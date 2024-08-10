
using OfficeOpenXml;
using PagedList;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using webproject.DAL.DB;
using webproject.DAL.Repositories;
using webproject.Models;


namespace webproject.Controllers
{
    public class ResultsController : Controller
    {
        #region global and repo
        private IQuestionaireRepository _questionaire;
        private IExaminationsRepository _exams;
        private ICategoryRepository _category;
        private IEmployeeRepository _employee;
        private IUniqueCodesRepository _codes;
        // tables
        tbl_questionnaire _tblques = new tbl_questionnaire();
        tbl_examinations _tblExams = new tbl_examinations();
        tbl_category _tblcategory = new tbl_category();
        tbl_employee _tblemployee = new tbl_employee();
        tbl_unique_codes tbl_codes = new tbl_unique_codes();

        public ResultsController()
        {
            this._questionaire = new QuestionaireRepository(new OESEntities());
            this._category = new CategoryRepository(new OESEntities());
            this._exams = new ExaminationsRepository(new OESEntities());
            this._employee = new EmployeeRepository(new OESEntities());
            this._codes = new UniqueCodesRepository(new OESEntities());
        }
        public ResultsController(IQuestionaireRepository repo, ICategoryRepository category, IExaminationsRepository exams, IEmployeeRepository employee, IUniqueCodesRepository codes)
        {
            this._questionaire = repo;
            this._category = category;
            this._exams = exams;
            this._employee = employee;
            this._codes = codes;
        }

        #endregion

        #region Results list
        public ActionResult Results(int? page)
        {
            var fullname = Request.Cookies["Fullname"].Value.ToString();
            var empID = Request.Cookies["EmpID"].Value.ToString();

            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }
            var tmp = _exams.EmployeeResultsList(fullname, empID.Trim().Replace("-", ""))
                            .Select(x => new ResultsViewModel 
                            {
                                ExamID = x.exam_id,
                                EmpID = x.emp_id,
                                Title = x.title,
                                Category = x.category_name,
                                FullName = x.fullname,
                                Department = x.department,
                                DateAnswered = x.date_answered.ToString(),
                                FirstScore = x.score_attempt1,
                                LatestScore = x.score_latest_attempt
                                
                            })
                            .OrderBy(x => x.Attempt);
            //var tmp = (

            //        from e in _exams.GetExaminations()
            //        join q in _questionaire.GetQuestionaires() on e.exam_id equals q.exam_id
            //        join c in _category.GetCategories() on q.category_id equals c.category_id
            //        join emp in _employee.GetEmployees() on e.emp_id equals emp.emp_id.Trim()
            //        where q.added_by.Equals(fullname) || q.allow_access.Contains(empID.Trim().Replace("-", ""))
            //        group e by new
            //        {
            //            e.emp_id,
            //            e.exam_id,
            //           // e.score,
            //            DateTime = Convert.ToDateTime(e.date_answered).ToShortDateString(),
            //            q.title,
            //            c.category_name,
            //            emp.fullname,
            //            emp.department,
            //        } into g
            //        select new ResultsViewModel
            //        {
            //            ExamID = g.Key.exam_id.ToString(),
            //            EmpID = g.Key.emp_id,
            //            Title = g.Key.title,
            //            Category = g.Key.category_name,
            //            FullName = g.Key.fullname,
            //            Department = g.Key.department,
            //            DateAnswered = g.Key.DateTime,
            //            Score = _exams.GetExaminations().Where(s => s.exam_id == g.Key.exam_id && s.emp_id.Equals(g.Key.emp_id)).OrderByDescending(x => x.attempt).Select(s => s.score).FirstOrDefault().ToString(),
            //          }).ToList();


            return View(tmp.ToPagedList(page ?? 1, 50));
        }

        public ActionResult VisitorResults(int? page, int? catogory)
        {
            var fullname = Request.Cookies["Fullname"].Value.ToString();
            var empID = Request.Cookies["EmpID"].Value.ToString();

            var tmp = (

                  from e in _exams.GetExaminations()
                  join q in _questionaire.GetQuestionaires() on e.exam_id equals q.exam_id
                  join c in _category.GetCategories() on q.category_id equals c.category_id
                  join code in _codes.GetCodes() on e.emp_id equals code.emp_id
                  where (q.added_by.Equals(fullname) || q.allow_access.Contains(empID.Trim().Replace("-", ""))) && code.isVisitor.Equals("1")
                  group e by new
                  {
                      e.emp_id,
                      e.exam_id,
                      e.score,
                      e.attempt,
                      DateTime = Convert.ToDateTime(e.date_answered).ToShortDateString(),
                      q.title,
                      c.category_name,
                      code.fname,
                      code.lname,
                      code.mname,
                  } into g
                  select new ResultsViewModel
                  {
                      ExamID = g.Key.exam_id,
                      EmpID = g.Key.emp_id,
                      Title = g.Key.title,
                      Category = g.Key.category_name,
                      FullName = g.Key.fname + " " + g.Key.mname + " " + g.Key.lname,
                      DateAnswered = g.Key.DateTime,
                      FirstScore = g.Key.score,
                      Attempt = g.Key.attempt.ToString()
                  }).ToList();
            var results = tmp.GroupBy(a => a.EmpID).Select(a => a.FirstOrDefault()).ToList();
            return View(results.ToPagedList(page ?? 1, 50));

        }
        #endregion

        #region Summary / Breakdown of results
        public ActionResult Summary(int? page)
        {
            var fullname = Request.Cookies["Fullname"].Value.ToString();
            var empID = Request.Cookies["EmpID"].Value.ToString();
            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }
       
            var tmp = _exams.ExamResultsBySubject(fullname.Trim(), empID.Trim().Replace("-", ""))
                       .Select(x => new SummaryVM
                       {
                           ExamID   = x.exam_id.ToString(),
                           Category = x.category_name,
                           Title    = x.title,
                           Percentage = x.total_percentage.ToString()
                       }).ToList();

            var maintenance = tmp.GroupBy(a => a.ExamID).Select(a => a.FirstOrDefault()).ToList();
            return View(maintenance.ToPagedList(page ?? 1, 50));
        }

        public ActionResult SummaryDetails(string examID)
        {
            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }

            var details = GetSummaryResults(examID);
            return View(details);
        }

        public List<SummaryDetails> GetSummaryResults(string examID)
        {
            //Displays results via generated of codes
            //var gnratd = (from e in _exams.ExaminationResultsSummary(Convert.ToInt32(examID), "without pc")
            //              select new SummaryDetails
            //              {
            //                  ExamID = e.exam_id.ToString(),
            //                  Title = e.title,
            //                  EmployeeName = e.fullname,
            //                  EmpID = e.emp_id,
            //                  Score = e.score.ToString(),
            //                  Total = _questionaire.GetQuestionaires().Where(t => t.exam_id == Convert.ToInt32(examID)).Count().ToString(),
            //                  PassingRate = e.passing_rate.Insert(0, ".").ToString(),
            //                  DateAnswered = Convert.ToDateTime(e.date_answered).ToShortDateString(),
            //                  Percentage = e.score_percentage.ToString()
            //              }).ToList();


            var nonGnratd = (from e in _exams.ExaminationResultsSummary(Convert.ToInt32(examID), "with pc")
                             select new SummaryDetails
                             {
                                 ExamID = e.exam_id.ToString(),
                                 Title = e.title,
                                 EmployeeName = e.fullname,
                                 EmpID = e.emp_id,
                                 Score = e.score.ToString(),
                                 Total = _questionaire.GetQuestionaires().Where(t => t.exam_id == Convert.ToInt32(examID)).Count().ToString(),
                                 PassingRate = e.passing_rate.Insert(0, ".").ToString(),
                                 DateAnswered = Convert.ToDateTime(e.date_answered).ToShortDateString(),
                                // Percentage = e.score_percentage.ToString()
                             }).ToList();

           // var tmp = gnratd.Concat(nonGnratd).ToList();

         //   var details = nonGnratd.GroupBy(a => a.EmpID).Select(a => a.FirstOrDefault()).ToList();

            return nonGnratd;
        }
        #endregion

        #region Export to excel

        public ActionResult ExportToExcel(string ExamID)
        {
            string filename = "ExaminationsResult-" + DateTime.Today.ToShortDateString() + ".xlsx";

            var collection = GetSummaryResults(ExamID).ToList();

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var package = new ExcelPackage(new FileInfo("MyWorkbook.xlsx")))
            {
                ExcelWorksheet Sheet1 = package.Workbook.Worksheets.Add("Examinations Result");

                DataTable tbl = new DataTable();

                tbl.Columns.Add("Employee ID", typeof(string));
                tbl.Columns.Add("Employee Name", typeof(string));
                tbl.Columns.Add("Score", typeof(int));
                tbl.Columns.Add("Passing Score", typeof(int));
                tbl.Columns.Add("Total Score", typeof(int));
                tbl.Columns.Add("Date Answered", typeof(string));

                int passingscore = 0;
                foreach (var g in collection)
                {
                    passingscore = Convert.ToInt32(Convert.ToDouble(g.Total) * Convert.ToDouble(g.PassingRate));

                    tbl.Rows.Add(g.EmpID, g.EmployeeName,Convert.ToInt32(g.Score), passingscore, g.Total, g.DateAnswered);
                }

                Sheet1.Cells[1, 1].LoadFromDataTable(tbl, true, OfficeOpenXml.Table.TableStyles.Light8);
                Sheet1.Cells["A:AZ"].AutoFitColumns();
                Response.Clear();
                Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                Response.AddHeader("content-disposition", "attachment: filename=" + filename);
                Response.BinaryWrite(package.GetAsByteArray());
                Response.End();
            }

            return View();
        }
        #endregion
    }
}