using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PagedList;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using webproject.DAL.DB;
using webproject.DAL.Repositories;
using webproject.Models;

namespace webproject.Controllers
{
    public class ExaminationsController : Controller
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
        tbl_unique_codes _tblcodes = new tbl_unique_codes();


        public ExaminationsController()
        {
            this._questionaire = new QuestionaireRepository(new OESEntities());
            this._category = new CategoryRepository(new OESEntities());
            this._exams = new ExaminationsRepository(new OESEntities());
            this._employee = new EmployeeRepository(new OESEntities());
            this._codes = new UniqueCodesRepository(new OESEntities());
        }
        public ExaminationsController(IQuestionaireRepository repo, ICategoryRepository category, IExaminationsRepository exams, IEmployeeRepository employee, IUniqueCodesRepository codes)
        {
            this._questionaire = repo;
            this._category = category;
            this._exams = exams;
            this._employee = employee;
            this._codes = codes;
        }
        List<string> prvAnswers = new List<string>();
        #endregion

        // GET: /Questionaire/
        public ActionResult Examinations(int? page)
        {
            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }
            string empType = "";
            var empID = Request.Cookies["EmpID"].Value.ToString();

            switch (empID.Substring(0, 3))
            {
                case "g82": empType = "CGSI Employees"; break;
                case "g85": empType = "Good Job Employees"; break;
                default: empType = "RIMP Employees"; break;
            }

            var questionaire = _questionaire.GetQuestionaires();
            var category = _category.GetCategories();
            var examResult = _exams.GetExaminations();

            var tmp = (from q in questionaire
                       join ca in category on q.category_id equals ca.category_id
                       where q.examinee.Contains(empID.Replace("-", "")) || q.examinee.Contains(empType) || q.examinee.Contains("All Employees")
                       select new ExaminationsModel
                       {
                           ExamID = q.exam_id,
                           Category = ca.category_name,
                           Title = q.title,
                           DateAnswered = examResult.Where(e => e.exam_id == q.exam_id && e.q_id == q.q_id && e.emp_id == empID).Select(e => e.date_answered).LastOrDefault(),
                           Score = examResult.Where(e => e.exam_id == q.exam_id && e.q_id == q.q_id && e.emp_id == empID).Select(e => e.score).LastOrDefault().ToString()

                       }).ToList();


            var examination = tmp.GroupBy(a => a.ExamID).Select(a => a.FirstOrDefault()).ToList();
            return View(examination.ToPagedList(page ?? 1, 50));
        }

        public ActionResult TakeExam(int examId)
        {
            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }


            var examination = (from q in _questionaire.GetQuestionaires()
                               join c in _category.GetCategories()
                               on q.category_id equals c.category_id
                               where q.exam_id.Equals(examId)
                               orderby q.general_instruction ascending
                               select new TakeExamModel
                               {
                                   OP_ID = q.q_id,
                                   Title = q.title,
                                   Category = c.category_name,
                                   TestType = q.test_type,
                                   GeneralInstruction = q.general_instruction,
                                   Question = q.question,
                                   Choices = q.choices,
                                   Answer = q.answer,
                                   ExamID = q.exam_id,
                                   hrLimit = (Convert.ToInt32(q.time_limit.Substring(0, q.time_limit.LastIndexOf(";") + 0)) * 60).ToString(),
                                   minLimit = q.time_limit.Substring(q.time_limit.LastIndexOf(';') + 1),
                                   DiagramImgName = q.image_name,
                                   ChoicesImgName = q.choices_img,
                                   InAnyOrder = q.in_any_order,
                                   Points = q.essay_points
                               }).ToList();

            //  ViewBag.genInstruction = examination.ToList();
            // ViewBag.categories = _category.GetCategories().ToList();
            ViewBag.HasExam = _exams.GetExaminations()
                                    .Where(x => x.emp_id.Trim() == Request.Cookies["EmpID"].Value.ToString().Trim())
                                    .Select(x => x.emp_id)
                                    .FirstOrDefault();
                                   
           ViewBag.examMax = examination.Max(q => q.OP_ID);
           ViewBag.examMin = examination.Min(q => q.OP_ID);
            return View(examination);
        }

        public ActionResult SubmitExam(string ExamID, string EmpID, List<string> Answer)
        {

            JavaScriptSerializer js = new JavaScriptSerializer();

            var output = js.Serialize(Answer);
            var parse = JArray.Parse(output);

            int? attempt = 0;
            int? totalScore = 0;


            var essayPts = _questionaire.GetQuestionaires().Where(e => e.exam_id.Equals(Convert.ToInt32(ExamID)) && e.test_type.Equals("Essay")).Select(e => e.essay_points).FirstOrDefault();
            var essayCnt = _questionaire.GetQuestionaires().Where(q => q.exam_id.Equals(Convert.ToInt32(ExamID)) && q.test_type.Equals("Essay")).Count();

            var essayPoints = (Convert.ToInt32(essayPts) * essayCnt);

            try
            {
                attempt = _exams.GetExaminations().Where(a => a.emp_id.Equals(EmpID) && a.exam_id == Convert.ToInt32(ExamID)).Max(a => a.attempt);
            }
            catch
            {

            }
            if (attempt != 0 && attempt != null) // Already has an examination history
            {
                attempt += 1;
               totalScore = _exams.GetExaminations().Where(ex => ex.exam_id.Equals(Convert.ToInt32(ExamID))).Select(ex => ex.total_score).FirstOrDefault();
            }
            else // First attempt
            {
                attempt = 1;
                totalScore = _questionaire.GetQuestionaires().Where(ques => ques.exam_id.Equals(Convert.ToInt32(ExamID)) && !(ques.test_type.Equals("Essay"))).Count();
            }

            for (int i = 0; i < Answer.Count; i++)
            {
                var q_id = "";
                var answer = "";
                var duration = "";
                int count = 1;

                dynamic elements = JsonConvert.DeserializeObject(parse[i].ToString());

                foreach (var item in elements)
                {
                    string tmp = item.ToString();
                    tmp.Substring(1, tmp.Length - 1);
                    tmp.Substring(0, tmp.Length - 1);

                    var messy = Regex.Replace(tmp, @"[""\\]", "");
                    var clean = messy.Substring(messy.IndexOf(":") + 2);

                    switch (count)
                    {
                        case 1: q_id = clean; break;
                        case 2: answer = clean; break;
                        case 3: duration = clean; break;
                    }
                    count++;
                }

                _tblExams.emp_id = EmpID;
                _tblExams.exam_id = Convert.ToInt32(ExamID);
                _tblExams.q_id = Convert.ToInt32(q_id);
                _tblExams.attempt = attempt;
                _tblExams.answer = answer;
                _tblExams.score = 0;
                _tblExams.date_answered = Convert.ToString(DateTime.Now);
                _tblExams.exam_duration = duration;
                _tblExams.total_score = (totalScore + Convert.ToInt32(essayPoints));
                _tblExams.essay_flag = "";

                _exams.InsertExaminations(_tblExams);
                _exams.Save();
            }

          
            calculateScore(EmpID, ExamID, attempt);

            var cntrolNo = _codes.GetCodes().Where(c => c.exam_id.Equals(Convert.ToInt32(ExamID)) && c.emp_id.Equals(EmpID))
                                 .Select(c => c.control_no).FirstOrDefault();

            var result = new { examID = ExamID, empID = EmpID, controlNo = cntrolNo };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult OpenExamHistory(int examId, string empID, int? page)
        {
            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }

            //var exam = (from q in _questionaire.GetQuestionaires()
            //            join c in _exams.GetExaminations() on q.q_id equals c.q_id
            //            join e in _employee.GetEmployees() on c.emp_id.Trim() equals e.emp_id.Trim()
            //            where c.emp_id.Trim().Equals(empID.Trim()) && c.exam_id.Equals(Convert.ToInt32(examId))
            //            orderby q.general_instruction ascending
            //            select new ExamHistory
            //            {
            //                OP_ID = q.q_id,
            //                EmpID = c.emp_id,
            //                Title = q.title,
            //                Category = "",
            //                TestType = q.test_type,
            //                GeneralInstruction = q.general_instruction,
            //                Question = q.question,
            //                Choices = q.choices,
            //                CorrectAnswer = q.answer,
            //                UserAnswer = c.answer,
            //                ExamID = q.exam_id,
            //                Score = c.score.ToString(),
            //                Attempt = c.attempt.ToString(),
            //                TotalScore = _exams.GetExaminations().Where(ex => ex.exam_id.Equals(Convert.ToInt32(examId))).Select(ex => ex.total_score).FirstOrDefault().ToString(),
            //                Examinee = e.fullname,
            //                PassingRate = q.passing_rate.Insert(0, ".").ToString(),
            //                EssayFlag = c.essay_flag.Trim(),
            //                UserControl = e.user_rights,
            //                Duration = c.exam_duration,
            //                ImgName = q.image_name,
            //                ChoicesImgName = q.choices_img,
            //                InAnyOrder = q.in_any_order,
            //                InAnyOrderAns = c.concat_any_order,
            //                Points = q.essay_points
            //            }).ToList();

            var Exam = _exams.ExamineeHistory(empID, examId)
                             .Select(x => new ExamHistory
                             {
                                 OP_ID = x.q_id,
                                 EmpID = x.emp_id,
                                 Title = x.title,
                                 TestType = x.test_type,
                                 GeneralInstruction = x.general_instruction,
                                 Question = x.question,
                                 Choices = x.choices,
                                 CorrectAnswer = x.answer,
                                 UserAnswer = x.user_answer,
                                 ExamID = x.exam_id,
                                 Score = x.score.ToString(),
                                 Attempt = x.attempt.ToString(),
                                 TotalScore = x.total_score.ToString(),
                                 Examinee = x.fullname,
                                 PassingRate = "."+ x.passing_rate,
                                 EssayFlag = x.essay_flag,
                                 Duration = x.exam_duration,
                                 ImgName = x.image_name,
                                 ChoicesImgName = x.choices,
                                 InAnyOrder = x.in_any_order,
                                 Points = x.essay_points
                             });
            var Enumerations = _exams.EnumerationAnswer(examId).Select(x => x.answer.Trim().ToLower()).ToList();

            ViewBag.examHistory = Convert.ToInt32(Exam.Where(a => a.ExamID == Convert.ToInt32(examId)).Max(a => a.Attempt));
            ViewBag.EnumrationAns = Enumerations;
            ViewBag.EnumrationAnsCount = Enumerations.Count();
            return View(Exam);
        }

        public ActionResult OpenVisitorExam(string examId, string empID, int? page)
        {
            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }

            var exam = (from q in _questionaire.GetQuestionaires()
                        join c in _exams.GetExaminations() on q.q_id equals c.q_id
                        join e in _codes.GetCodes() on c.emp_id equals e.emp_id
                        where c.emp_id.Equals(empID)
                        orderby q.general_instruction ascending
                        select new ExamHistory
                        {
                            OP_ID = q.q_id,
                            EmpID = c.emp_id,
                            Title = q.title,
                            Category = "",
                            TestType = q.test_type,
                            GeneralInstruction = q.general_instruction,
                            Question = q.question,
                            Choices = q.choices,
                            CorrectAnswer = q.answer,
                            UserAnswer = c.answer,
                            ExamID = q.exam_id,
                            Score = c.score.ToString(),
                            // note: overide attempt, attempt = visitor number of exam
                            Attempt = _exams.GetExaminations().Where(a => a.emp_id.Equals(empID)).Select(a => a.exam_id).FirstOrDefault().ToString(),
                            // -- E N D -- 
                            TotalScore = c.total_score.ToString(),
                            Examinee = e.fname + " " + e.lname,
                            PassingRate = q.passing_rate.Insert(0, ".").ToString(),
                            EssayFlag = c.essay_flag.Trim(),
                            Duration = c.exam_duration,
                            ChoicesImgName = q.choices_img,
                            ImgName = q.image_name,
                            InAnyOrder = q.in_any_order,
                            InAnyOrderAns = c.concat_any_order,
                            Points = q.essay_points,
                            EssayPts = c.score.ToString()
                        }).ToList();

            var visitor = exam.GroupBy(a => a.OP_ID).Select(a => a.FirstOrDefault()).ToList();
            ViewBag.examHistory = exam.GroupBy(a => a.ExamID).Select(a => a.FirstOrDefault()).ToList();

            return View(visitor);
        }

        public ActionResult updateEssayScore(string content, string examID, string empID, string attempt, string QID, string isVisitor)
        {


            var crrectAnswer = _questionaire.GetQuestionaires().Where(ca => ca.q_id.Equals(Convert.ToInt32(QID))).Select(ca => ca.answer).FirstOrDefault();
            if (isVisitor == "0") // employee
            {
                var essay = _exams.GetExaminations().Where(e => e.q_id.Equals(Convert.ToInt32(QID))
                            && e.emp_id.Equals(empID)
                            && e.attempt.Equals(Convert.ToInt32(attempt))).FirstOrDefault();

                if (content.Equals("1"))
                {
                    essay.answer = crrectAnswer;
                }

                essay.essay_flag = "graded";
                _exams.UpdateExaminations(essay);
                _exams.Save();


                var history = _exams.GetExaminations()
                                        .Where(h => h.emp_id.Trim().Equals(empID.Trim())
                                        && h.exam_id.Equals(Convert.ToInt32(examID))
                                        && h.attempt.Equals(Convert.ToInt32(attempt))).FirstOrDefault();

                var query = "UPDATE tbl_examinations SET score ='"
                            + ((Convert.ToInt32(history.score) + Convert.ToInt32(content)).ToString())
                            + "' WHERE  exam_id =" + examID + "AND attempt=" + Convert.ToInt32(attempt)
                            + "AND emp_id='" + empID + "'";

                using (var context = new OESEntities())
                {
                    context.Database.ExecuteSqlCommand(query);
                }
            }
            else // applicant
            {

                var history = _exams.GetExaminations()
                                        .Where(h => h.emp_id.Trim().Equals(empID.Trim())
                                        && h.q_id.Equals(Convert.ToInt32(QID))).FirstOrDefault();

                history.essay_flag = "graded";
                _exams.UpdateExaminations(history);
                _exams.Save();

                var query = "UPDATE tbl_examinations SET score ='"
                            + ((Convert.ToInt32(history.score) + Convert.ToInt32(content)).ToString())
                            + "' WHERE  exam_id =" + examID
                            + "AND emp_id='" + empID + "'";

                using (var context = new OESEntities())
                {
                    context.Database.ExecuteSqlCommand(query);
                }
            }
            return View();
        }

        #region AutoGenerated

        public ActionResult AutoGeneratedList(string code)
        {
            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }

            var tmp = (from q in _questionaire.GetQuestionaires()
                       join c in _codes.GetCodes() on q.exam_id equals c.exam_id
                       where c.control_no.Equals(code)
                       select new AutoExamList
                       {
                           ID = c.uc_id,
                           ControlNo = c.control_no,
                           FirstName = c.fname,
                           MiddleName = c.mname,
                           LastName = c.lname,
                           TimeLimit = q.time_limit,
                           Title = q.title,
                           examID = Convert.ToInt32(q.exam_id),
                           Hr = q.time_limit.Substring(0, q.time_limit.LastIndexOf(";") + 0),
                           Min = q.time_limit.Substring(q.time_limit.LastIndexOf(';') + 1),
                           IsVisitor = c.isVisitor,
                           Status = _exams.GetExaminations().Where(e => e.emp_id.Equals(c.emp_id) && e.exam_id.Equals(c.exam_id)).Select(e => e.exam_id).FirstOrDefault().ToString()
                       }).ToList();
            var exams = tmp.GroupBy(a => a.Title).Select(a => a.FirstOrDefault()).ToList();
            return View(exams);
        }

        public ActionResult autoGeneratedExam(int examId)
        {
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }

            var examination = (from q in _questionaire.GetQuestionaires()
                               join c in _category.GetCategories()
                               on q.category_id equals c.category_id
                               where q.exam_id.Equals(examId)
                               orderby q.general_instruction ascending
                               select new TakeExamModel
                               {
                                   OP_ID = q.q_id,
                                   Title = q.title,
                                   Category = c.category_name,
                                   TestType = q.test_type,
                                   GeneralInstruction = q.general_instruction,
                                   Question = q.question,
                                   Choices = q.choices,
                                   Answer = q.answer,
                                   ExamID = q.exam_id,
                                   hrLimit = (Convert.ToInt32(q.time_limit.Substring(0, q.time_limit.LastIndexOf(";") + 0)) * 60).ToString(),
                                   minLimit = q.time_limit.Substring(q.time_limit.LastIndexOf(';') + 1),
                                   InAnyOrder = q.in_any_order,
                                   ChoicesImgName = q.choices_img,
                                   DiagramImgName = q.image_name,
                                   Points = q.essay_points
                               }).ToList();

            ViewBag.genInstruction = examination.ToList();
            ViewBag.categories = _category.GetCategories().ToList();
            ViewBag.examMax = examination.Max(q => q.OP_ID);
            ViewBag.examMin = examination.Min(q => q.OP_ID);
            return View(examination);
        }
        #endregion

        #region Functions

        public int enumerationAnyOrder(string examID, string empID, string attempt, string answer, string itemQuestion)
        {
            var tmpQuestion = "";
            var strAllAns = "";
            var strAllIds = "";
            int pts = 0;
            int isRepeated = 0;


            //Check if answer already been checked.
            if (prvAnswers.Count > 0)
            {
                for (int i = 0; i < prvAnswers.Count; i++)
                {
                    if (prvAnswers[i].Equals(answer))
                    {
                        isRepeated = 1;
                    }
                    else
                    {
                        prvAnswers.Add(answer);
                        break;
                    }
                }
            }
            else
            {
                prvAnswers.Add(answer);
            }

            if (isRepeated == 0)
            {
                var answers = (from q in _questionaire.GetQuestionaires()
                               where q.exam_id.Equals(Convert.ToInt32(examID)) && q.test_type.Equals("Enumeration") && q.in_any_order.Equals("Yes")
                               select q
                  ).ToList();


                foreach (var question in answers)
                {
                    var tmp = question.question;
                    var tm = tmpQuestion;

                    if (itemQuestion.Equals(question.question))
                    {

                        var quesAllAns = _questionaire.GetQuestionaires().Where(qa => qa.question.Equals(itemQuestion)).ToList();

                        foreach (var quesAns in quesAllAns)
                        {
                            strAllAns += quesAns.answer + ", ";
                            strAllIds += quesAns.q_id + ",";
                        }

                        if (strAllAns.ToUpper().Contains(answer)) pts++;

                        var ids = strAllIds.Substring(0, strAllIds.Length - 1);
                        var updConcat = "UPDATE tbl_examinations SET concat_any_order ='" + strAllAns +
                                         "', score = '" + pts + "'" +
                                         " WHERE  exam_id = '" + Convert.ToInt32(examID) + "' AND emp_id='" + empID + "' AND attempt =" + attempt +
                                         " AND q_id IN(" + ids + ")";

                        using (var context = new OESEntities())
                        {
                            context.Database.ExecuteSqlCommand(updConcat);
                        }
                        strAllAns = "";
                        strAllIds = "";
                        itemQuestion = "";                       
                    }
                }
            }
            return pts;
        }

        public void calculateScore(string empID, string examID, int? attempt)
        {

            var correctAnswer = _questionaire.GetQuestionaires().Where(a => a.exam_id.Equals(Convert.ToInt32(examID))).OrderBy(a => a.q_id).ToList();
            var userAnswer = _exams.GetExaminations().Where(u => u.exam_id.Equals(Convert.ToInt32(examID))
                             && u.emp_id.Equals(empID) && u.attempt == attempt).OrderBy(u => u.q_id).ToList();

            int score = 0;
            var calPrvQuestion = "";
            foreach (var crctAns in correctAnswer)
            {
                foreach (var usrAns in userAnswer)
                {
                    if (crctAns.q_id == usrAns.q_id)
                    {
                        // All uppercase
                        string usrAllUpper = usrAns.answer.ToUpper().Replace(" ", "");
                        string crctAllUpper = crctAns.answer.ToUpper().Replace(" ", "");

                        if (!(crctAns.test_type.Equals("Enumeration")))
                        {
                            if (crctAllUpper.Equals(usrAllUpper))
                            {
                                score++;

                                if (crctAns.test_type.Equals("Essay"))
                                {
                                    usrAns.essay_flag = "graded";
                                    _exams.UpdateExaminations(usrAns);
                                    _exams.Save();
                                }
                                else
                                {
                                    usrAns.essay_flag = "";
                                    _exams.UpdateExaminations(usrAns);
                                    _exams.Save();
                                }
                            }
                            else
                            {
                                if (crctAllUpper.Contains("OR") && !(crctAns.test_type.Equals("Essay")))
                                {
                                    var crctAnsLength = crctAllUpper.Split(new[] { "OR" }, StringSplitOptions.None);

                                    for (int l = 0; l < crctAnsLength.Length; l++)
                                    {
                                        var tmp = crctAnsLength[l];
                                        if (usrAllUpper.Equals(crctAnsLength[l]))
                                            score++;
                                    }
                                }

                                if (crctAns.test_type.Equals("Essay"))
                                {
                                    usrAns.essay_flag = "not graded";
                                    _exams.UpdateExaminations(usrAns);
                                    _exams.Save();
                                }
                                else
                                {
                                    usrAns.essay_flag = "";
                                    _exams.UpdateExaminations(usrAns);
                                    _exams.Save();
                                }
                            }
                        }
                        else
                        {
                            if (crctAns.in_any_order.Equals("Yes"))
                            {
                                if (!(calPrvQuestion.Equals(crctAns.question)))
                                {
                                    prvAnswers.Clear();
                                }
                                calPrvQuestion = crctAns.question;
                                score += enumerationAnyOrder(examID, empID, attempt.ToString(), usrAllUpper, crctAns.question);
                            }
                            else if (crctAns.in_any_order.Equals("No"))
                            {
                                if (crctAllUpper.Equals(usrAllUpper)) score++;
                            }
                        }
                    }
                }
            }

            var query = "UPDATE tbl_examinations SET score =" + score  + " WHERE  exam_id = '" + examID + "' AND emp_id='" + empID + "' AND attempt =" + attempt;
            using (var context = new OESEntities())
            {
                context.Database.ExecuteSqlCommand(query);
            }
        }
        #endregion

        public ActionResult GetRightAnswer(int QID, string Answer, string ExamType)
        {
            bool IsCorrect = false;

            if (ExamType != "enumeration")
            {
                var CorrectAns = _questionaire.GetQuestionByID(QID).answer;

                if (CorrectAns.ToLower().Trim() == Answer.ToLower().Trim())
                    IsCorrect = true;
            }
            else
            {
                //Get all answers for enumeration
                var Question = _questionaire.GetQuestionByID(QID).question;

                var Answers = _questionaire.GetQuestionaires()
                                           .Where(x => x.question == Question)
                                           .Select(x => x.answer)
                                           .ToList();

                foreach (var answer in Answers)
                {
                    if (Answer.Trim().ToLower() == answer.ToLower().Trim())
                    {
                        IsCorrect = true;
                        break;
                    }
                }
            }


            return Json(IsCorrect, JsonRequestBehavior.AllowGet);
        }
    }
}
