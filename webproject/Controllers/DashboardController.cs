using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using webproject.DAL.DB;
using webproject.DAL.Repositories;

namespace webproject.Controllers
{
    public class DashboardController : Controller
    {
        //Repo
        private IQuestionaireRepository _questionaire;
        private ICategoryRepository _category;
        private IEmployeeRepository _employee;
        private IExaminationsRepository _exams;
        public static int max;

        tbl_questionnaire _tblques = new tbl_questionnaire();
        tbl_category _tblcategory = new tbl_category();
        tbl_employee _tblemployee = new tbl_employee();
        tbl_examinations _tblExams = new tbl_examinations();
        public DashboardController()
        {
            this._questionaire = new QuestionaireRepository(new OESEntities());
            this._category = new CategoryRepository(new OESEntities());
            this._employee = new EmployeeRepository(new OESEntities());
            this._exams = new ExaminationsRepository(new OESEntities());
        }
        public DashboardController(IQuestionaireRepository repo, ICategoryRepository category, IEmployeeRepository employee, IExaminationsRepository exams)
        {
            this._questionaire = repo;
            this._category = category;
            this._employee = employee;
            this._exams = exams;
        }

        public ActionResult Dashboard()
        {
            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }

            
            var fullname = Request.Cookies["Fullname"].Value.ToString();
            var empId = Request.Cookies["EmpID"].Value.ToString();
            try
            {
                ViewBag.AnswrdQues = _exams.GetExaminations().Where(e => e.emp_id.Equals(empId)).GroupBy(e => e.exam_id).Count();

                ViewBag.Employee = _employee.GetEmployees().Count();

                ViewBag.Questionnaire = (from q in _questionaire.GetQuestionaires()
                                         join ca in _category.GetCategories() on q.category_id equals ca.category_id
                                         where q.allow_access.Contains(empId) || q.added_by.Equals(fullname)
                                         group q by new
                                         {
                                             q.exam_id
                                         } into g
                                         select g).Count();
            }
            catch { }
            return View();
        }
    }
}