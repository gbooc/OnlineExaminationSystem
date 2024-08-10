using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using webproject.DAL.DB;
using webproject.DAL.Repositories;
using webproject.Models;
using PagedList;
using System.IO;
using System.Drawing;

namespace webproject.Controllers
{
    public class MaintenanceController : Controller
    {
        #region Global and Repository Initialization/Declaration

        //Repo
        private IQuestionaireRepository _questionaire;
        private ICategoryRepository _category;
        private IEmployeeRepository _employee;
        private IExaminationsRepository _exam;
        private IUniqueCodesRepository _codes;

        public static int max;

        // tables
        tbl_questionnaire _tblques = new tbl_questionnaire();
        tbl_category _tblcategory = new tbl_category();
        tbl_employee _tblemployee = new tbl_employee();
        tbl_examinations _tblexamination = new tbl_examinations();
        tbl_unique_codes tbl_codes = new tbl_unique_codes();

        public MaintenanceController()
        {
            this._questionaire = new QuestionaireRepository(new OESEntities());
            this._category = new CategoryRepository(new OESEntities());
            this._employee = new EmployeeRepository(new OESEntities());
            this._exam = new ExaminationsRepository(new OESEntities());
            this._codes = new UniqueCodesRepository(new OESEntities());
        }
        public MaintenanceController(IQuestionaireRepository repo, ICategoryRepository category, IEmployeeRepository employee, IExaminationsRepository exam, IUniqueCodesRepository codes)
        {
            this._questionaire = repo;
            this._category = category;
            this._employee = employee;
            this._exam = exam;
            this._codes = codes;
        }

        public void setExamID()
        {
            var Tmpmax = _questionaire.GetQuestionaires().Max(a => a.exam_id);

            if (Tmpmax == null)
            {
                max = 1;
            }
            else
            {
                max = Convert.ToInt32(Tmpmax) + 1;
            }

        }
        public int getExamId()
        {
            return max;
        }

        #endregion

        #region Display all questionnaires
        // GET: /Maintenance/
        [HttpGet]
        public ActionResult Maintenance(int? page)
        {
            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }


            string empID = Request.Cookies["EmpID"].Value.ToString().Replace("-", "");
            var questionaire = _questionaire.GetQuestionaires();
            var category = _category.GetCategories();

            var tmp = (from q in questionaire
                       join ca in category on q.category_id equals ca.category_id
                       where q.allow_access.Contains(empID) || q.added_by.Equals(Request.Cookies["Fullname"].Value.ToString())
                       orderby q.date_added descending
                       select new MaintenanceViewModel
                       {
                           M_ID = q.q_id,
                           Category = ca.category_name,
                           QuestionaireTitle = q.title,
                           exam_id = q.exam_id,
                           AddedBy = q.added_by,
                           DateAdded = q.date_added,
                           UpdatedBy = q.updated_by,
                           Schedule = q.exam_schedule,
                           HasAccess = q.allow_access,
                           Examinee = q.examinee
                       }).ToList();

            var maintenance = tmp.GroupBy(a => a.exam_id).Select(a => a.FirstOrDefault()).ToList();
            ViewBag.Employee = _employee.GetEmployees().ToList();
            return View(maintenance.ToPagedList(page ?? 1, 50));

        }
        #endregion

        #region Questionnaire - retrieve / update / delete / Create / give access

        public ActionResult OpenQuestionaire(int examId)
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
                               select new OpenQuestionaire
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
                                   Schedule = q.exam_schedule,
                                   Examinee = q.examinee,
                                   Hour = q.time_limit.Substring(0, q.time_limit.LastIndexOf(";") + 0),
                                   Min = q.time_limit.Substring(q.time_limit.LastIndexOf(';') + 1),
                                   PassingRate = q.passing_rate,
                                   InAnyOrder = q.in_any_order,
                                   ImageName = q.image_name,
                                   ChoicesImgName = q.choices_img
                               }).ToList();

            ViewBag.genInstruction = examination.ToList();
            ViewBag.categories = _category.GetCategories().ToList();
            return View(examination);
        }

        public ActionResult updateQuestionaire(string id, string content, string fieldName, string TestType)
        {

            tbl_questionnaire ques = new tbl_questionnaire();
            var updatedBy = "";

            try
            {
                updatedBy = Request.Cookies["Fullname"].Value.ToString();
            }
            catch
            {
                return RedirectToAction("Index", "Home");
            }


            if (!(id.Equals("-1")) && !(id.Equals("-2")) && !(id.Equals("-3")) && !(id.Equals("-4")) && !(id.Equals("-5")) && !(id.Equals("-6")))
            {
                var recent = _questionaire.GetQuestionByID(Convert.ToInt32(id));
                var examId = recent.exam_id;

                switch (fieldName)
                {
                    case "1":
                            // update all gen instruction
                            var query = "UPDATE tbl_questionnaire SET general_instruction =" + "'" + content + "', updated_by='" + updatedBy + "' WHERE  exam_id =" + examId.ToString() + "AND test_type='" + TestType + "' AND general_instruction='" + recent.general_instruction+"'";
                            using (var context = new OESEntities())
                            {
                                context.Database.ExecuteSqlCommand(query);
                            }
                       
                        break;
                    case "2":
                        if (TestType.Equals("Enumeration"))
                        {
                            // update all gen instruction
                            var severalQues = "UPDATE tbl_questionnaire SET question =" + "'" + content + "', updated_by='" + updatedBy + "' WHERE  exam_id =" + examId.ToString() + "AND test_type='" + TestType + "' AND question ='" + recent.question + "'";
                            using (var context = new OESEntities())
                            {
                                context.Database.ExecuteSqlCommand(severalQues);
                            }
                        }
                        else
                        {
                            recent.question = content;
                        }  
                         
                              break;
                    case "3": recent.choices = content; break;
                    case "4": recent.answer = content; break;

                }

                if (!fieldName.Equals("1"))
                {
                    if (!(fieldName.Equals("2")) || (fieldName.Equals("2") && !(TestType.Equals("Enumeration"))))
                    {
                        _questionaire.UpdateQuestionaire(recent);
                        _questionaire.Save();
                    }
                  

                    if (fieldName.Equals("4"))
                    {
                        var prvExam = _exam.GetExaminations().Where(e => e.answer.Equals(content) && e.q_id == recent.q_id).ToList();

                        if (prvExam.Count == 0)
                        {
                            var updScore = "UPDATE tbl_examinations SET score = (score-" + 1 + ") WHERE exam_id =" + examId.ToString();
                            using (var context = new OESEntities())
                            {
                                context.Database.ExecuteSqlCommand(updScore);
                            }
                        }
                        else
                        {
                            var updScore = "UPDATE tbl_examinations SET score = (score+" + 1 + ") WHERE  exam_id =" + examId.ToString();
                            using (var context = new OESEntities())
                            {
                                context.Database.ExecuteSqlCommand(updScore);
                            }
                        }
                    }
                }
            }
            else if (id.Equals("-1"))
            {
                var query = "UPDATE tbl_questionnaire SET category_id =" + "'" + content + "', updated_by='" + updatedBy + "' WHERE  exam_id =" + fieldName;
                using (var context = new OESEntities())
                {
                    context.Database.ExecuteSqlCommand(query);
                }
            }
            else if (id.Equals("-2"))
            {
                var query = "UPDATE tbl_questionnaire SET title =" + "'" + content + "', updated_by='" + updatedBy + "' WHERE  exam_id =" + fieldName;
                using (var context = new OESEntities())
                {
                    context.Database.ExecuteSqlCommand(query);
                }
            }
            else if (id.Equals("-3"))
            {
                var query = "UPDATE tbl_questionnaire SET exam_schedule =" + "' " + content + " ', updated_by='" + updatedBy + "' WHERE  exam_id = " + fieldName;
                using (var context = new OESEntities())
                {
                    context.Database.ExecuteSqlCommand(query);
                }
            }
            else if (id.Equals("-4"))
            {
                var query = "UPDATE tbl_questionnaire SET examinee =" + "'" + content + "', updated_by='" + updatedBy + "' WHERE  exam_id =" + fieldName;
                using (var context = new OESEntities())
                {
                    context.Database.ExecuteSqlCommand(query);
                }
            }
            else if (id.Equals("-5"))
            {
                var query = "UPDATE tbl_questionnaire SET passing_rate =" + "'" + Regex.Replace(content, "[^0-9.]", "") + "', updated_by='" + updatedBy + "' WHERE  exam_id =" + fieldName;
                using (var context = new OESEntities())
                {
                    context.Database.ExecuteSqlCommand(query);
                }
            }
            else if (id.Equals("-6"))
            {
                var query = "UPDATE tbl_questionnaire SET time_limit =" + "'" + content + "', updated_by='" + updatedBy + "' WHERE  exam_id =" + fieldName;
                using (var context = new OESEntities())
                {
                    context.Database.ExecuteSqlCommand(query);
                }
            }

            return Json(JsonRequestBehavior.AllowGet);
        }


        public ActionResult NewQuestionaire()
        {
            //Check if is login
            if (HttpContext.User.Identity.Name == null || HttpContext.User.Identity.Name == "")
            {
                return RedirectToAction("Index", "Home");
            }

            var category = _category.GetCategories();
            var department = Request.Cookies["Department"].Value.ToString();
            var maintenance = (from c in category
                               where c.department.Equals(department)
                               select new NewQuestionaire
                               {
                                   category_id = c.category_id,
                                   Category = c.category_name
                               });
            ViewBag.AllEmployees = _employee.GetEmployees();
            return View(maintenance);
        }

        public ActionResult deleteQuestionaire(int id)
        {
            var questionnaire = _questionaire.GetQuestionaires().Where(a => a.exam_id == id).ToList();

            foreach (var i in questionnaire)
            {
                _questionaire.DeleteQuestionaire(i.q_id);
                _questionaire.Save();
            }
            return Json(JsonRequestBehavior.AllowGet);
        }

        public ActionResult GiveUserAccess(string usrIds, string examID)
        {
            var current = _questionaire.GetQuestionaires().Where(c => c.title.Equals(examID)).FirstOrDefault();

            var query = "UPDATE tbl_questionnaire SET allow_access =" + "'" + current.allow_access + usrIds + "'  WHERE  title ='" + examID + "'";
            using (var context = new OESEntities())
            {
                context.Database.ExecuteSqlCommand(query);
            }
            return Json(JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Questionaire savings
        public ActionResult saveMC(string Title, int Category, List<string> multipleChoice)
        {
            JavaScriptSerializer js = new JavaScriptSerializer();

            var output = js.Serialize(multipleChoice);
            var parse = JArray.Parse(output);

            for (int i = 0; i < multipleChoice.Count; i++)
            {
                var instruction = "";
                var question = "";
                var choices = "";
                var ans = "";
                var schedule = "";
                var examinee = "";
                var limit = "";
                var passingRate = "";
                int count = 1;

                dynamic elements = JsonConvert.DeserializeObject(parse[i].ToString());

                foreach (var item in elements)
                {
                    string tmp = item.ToString();

                    var messy = Regex.Replace(tmp, @"\r\n?|\\n", Environment.NewLine);
                    var rem1 = messy.Substring(messy.IndexOf(":") + 2);

                    var rem2 = rem1.Substring(1, rem1.Length - 1);
                    var clean = rem2.Substring(0, rem2.Length - 1);

                    switch (count)
                    {
                        case 1: instruction = clean; break;
                        case 2: question = clean; break;
                        case 3: choices = clean; break;
                        case 4: ans = clean; break;
                        case 5: schedule = clean; break;
                        case 6: examinee = clean; break;
                        case 7: limit = clean; break;
                        case 8: passingRate = clean; break;
                    }

                    count++;
                }

                _tblques.category_id = Category;
                _tblques.exam_id = getExamId();
                _tblques.test_type = "Multiple Choice";
                _tblques.title = Title;
                _tblques.general_instruction = instruction;
                _tblques.question = question;
                _tblques.choices = choices;
                _tblques.answer = ans;
                _tblques.department = Request.Cookies["Department"].Value.ToString();
                _tblques.added_by = Request.Cookies["Fullname"].Value.ToString();
                _tblques.date_added = Convert.ToString(DateTime.Now);
                _tblques.exam_schedule = schedule;
                _tblques.examinee = examinee;
                _tblques.time_limit = limit;
                _tblques.allow_access = Request.Cookies["EmpID"].Value.ToString().Replace("-", "");
                _tblques.passing_rate = passingRate;

                _questionaire.InsertQuestionaire(_tblques);
                _questionaire.Save();
            }
            return Json(JsonRequestBehavior.AllowGet);
        }

        public ActionResult saveFb(string Title, int Category, List<string> fillTheBlanks)
        {
            JavaScriptSerializer js = new JavaScriptSerializer();

            var output = js.Serialize(fillTheBlanks);
            var parse = JArray.Parse(output);

            for (int i = 0; i < fillTheBlanks.Count; i++)
            {
                var instruction = "";
                var question = "";
                var choices = "";
                var ans = "";
                var schedule = "";
                var examinee = "";
                var limit = "";
                var passingRate = "";
                int count = 1;

                dynamic elements = JsonConvert.DeserializeObject(parse[i].ToString());

                foreach (var item in elements)
                {
                    string tmp = item.ToString();

                    var messy = Regex.Replace(tmp, @"\r\n?|\\n", Environment.NewLine);
                    var rem1 = messy.Substring(messy.IndexOf(":") + 2);

                    var rem2 = rem1.Substring(1, rem1.Length - 1);
                    var clean = rem2.Substring(0, rem2.Length - 1);

                    switch (count)
                    {
                        case 1: instruction = clean; break;
                        case 2: question = clean; break;
                        case 3: ans = clean; break;
                        case 4: schedule = clean; break;
                        case 5: examinee = clean; break;
                        case 6: limit = clean; break;
                        case 7: passingRate = clean; break;
                    }
                    count++;
                }

                _tblques.category_id = Category;
                _tblques.exam_id = getExamId();
                _tblques.test_type = "Filling the blanks";
                _tblques.title = Title;
                _tblques.general_instruction = instruction;
                _tblques.question = question;
                _tblques.choices = choices;
                _tblques.answer = ans;
                _tblques.department = Request.Cookies["Department"].Value.ToString();
                _tblques.added_by = Request.Cookies["Fullname"].Value.ToString();
                _tblques.date_added = Convert.ToString(DateTime.Now);
                _tblques.exam_schedule = schedule;
                _tblques.examinee = examinee;
                _tblques.time_limit = limit;
                _tblques.allow_access = Request.Cookies["EmpID"].Value.ToString().Replace("-", "");
                _tblques.passing_rate = passingRate;

                _questionaire.InsertQuestionaire(_tblques);
                _questionaire.Save();
            }
            return Json(JsonRequestBehavior.AllowGet);

        }

        public ActionResult saveIdentification(string Title, int Category, List<string> identification)
        {
            JavaScriptSerializer js = new JavaScriptSerializer();

            var output = js.Serialize(identification);
            var parse = JArray.Parse(output);


            for (int i = 0; i < identification.Count; i++)
            {
                var instruction = "";
                var question = "";
                var choices = "";
                var ans = "";
                var schedule = "";
                var examinee = "";
                var limit = "";
                var passingRate = "";
                int count = 1;

                dynamic elements = JsonConvert.DeserializeObject(parse[i].ToString());

                foreach (var item in elements)
                {
                    string tmp = item.ToString();

                    var messy = Regex.Replace(tmp, @"\r\n?|\\n", Environment.NewLine);
                    var rem1 = messy.Substring(messy.IndexOf(":") + 2);

                    var rem2 = rem1.Substring(1, rem1.Length - 1);
                    var clean = rem2.Substring(0, rem2.Length - 1);

                    switch (count)
                    {
                        case 1: instruction = clean; break;
                        case 2: question = clean; break;
                        case 3: ans = clean; break;
                        case 4: schedule = clean; break;
                        case 5: examinee = clean; break;
                        case 6: limit = clean; break;
                        case 7: passingRate = clean; break;
                    }
                    count++;
                }
                _tblques.category_id = Category;
                _tblques.exam_id = getExamId();
                _tblques.test_type = "Identification";
                _tblques.title = Title;
                _tblques.general_instruction = instruction;
                _tblques.question = question;
                _tblques.choices = choices;
                _tblques.answer = ans;
                _tblques.department = Request.Cookies["Department"].Value.ToString();
                _tblques.added_by = Request.Cookies["Fullname"].Value.ToString();
                _tblques.date_added = Convert.ToString(DateTime.Now);
                _tblques.exam_schedule = schedule;
                _tblques.examinee = examinee;
                _tblques.time_limit = limit;
                _tblques.allow_access = Request.Cookies["EmpID"].Value.ToString().Replace("-", "");
                _tblques.passing_rate = passingRate;

                _questionaire.InsertQuestionaire(_tblques);
                _questionaire.Save();
            }
            return Json(JsonRequestBehavior.AllowGet);
        }

        public ActionResult saveEssay(string Title, int Category, List<string> Essay)
        {
            JavaScriptSerializer js = new JavaScriptSerializer();

            var output = js.Serialize(Essay);
            var parse = JArray.Parse(output);

            for (int i = 0; i < Essay.Count; i++)
            {
                var instruction = "";
                var question = "";
                var choices = "";
                var ans = "";
                var schedule = "";
                var examinee = "";
                var limit = "";
                var passingRate = "";
                var essayPoints = "";
                int count = 1;

                dynamic elements = JsonConvert.DeserializeObject(parse[i].ToString());

                foreach (var item in elements)
                {
                    string tmp = item.ToString();

                    var messy = Regex.Replace(tmp, @"\r\n?|\\n", Environment.NewLine);
                    var rem1 = messy.Substring(messy.IndexOf(":") + 2);

                    var rem2 = rem1.Substring(1, rem1.Length - 1);
                    var clean = rem2.Substring(0, rem2.Length - 1);

                    switch (count)
                    {
                        case 1: instruction = clean; break;
                        case 2: question = clean; break;
                        case 3: ans = clean; break;
                        case 4: schedule = clean; break;
                        case 5: examinee = clean; break;
                        case 6: limit = clean; break;
                        case 7: passingRate = clean; break;
                        case 8: essayPoints = clean; break;
                    }
                    count++;
                }

                _tblques.category_id = Category;
                _tblques.exam_id = getExamId();
                _tblques.test_type = "Essay";
                _tblques.title = Title;
                _tblques.general_instruction = instruction;
                _tblques.question = question;
                _tblques.choices = choices;
                _tblques.answer = ans;
                _tblques.department = Request.Cookies["Department"].Value.ToString();
                _tblques.added_by = Request.Cookies["Fullname"].Value.ToString();
                _tblques.date_added = Convert.ToString(DateTime.Now);
                _tblques.exam_schedule = schedule;
                _tblques.examinee = examinee;
                _tblques.time_limit = limit;
                _tblques.allow_access = Request.Cookies["EmpID"].Value.ToString().Replace("-", "");
                _tblques.passing_rate = passingRate;
                _tblques.essay_points = essayPoints;

                _questionaire.InsertQuestionaire(_tblques);
                _questionaire.Save();
            }
            return Json(JsonRequestBehavior.AllowGet);
        }

        public ActionResult saveDiagramExam(string Title, int Category, List<string> DiagramExam)
        {
            JavaScriptSerializer js = new JavaScriptSerializer();

            var output = js.Serialize(DiagramExam);
            var parse = JArray.Parse(output);

            string prevDiagram = "";
            string fileName = "";
            for (int i = 0; i < DiagramExam.Count; i++)
            {
                var instruction = "";
                var question = "";
                var choicesTxt = "";
                var choicesImg = "";
                var ans = "";
                var schedule = "";
                var examinee = "";
                var limit = "";
                var passingRate = "";
                int count = 1;

                dynamic elements = JsonConvert.DeserializeObject(parse[i].ToString());

                foreach (var item in elements)
                {
                    string tmp = item.ToString();

                    var messy = Regex.Replace(tmp, @"\r\n?|\\n", Environment.NewLine);
                    var rem1 = messy.Substring(messy.IndexOf(":") + 2);

                    var rem2 = rem1.Substring(1, rem1.Length - 1);
                    var clean = rem2.Substring(0, rem2.Length - 1);

                    switch (count)
                    {
                        case 1: instruction = clean; break;
                        case 2: question = clean; break;
                        case 3:

                            if (prevDiagram.Equals(""))
                            {
                                prevDiagram = clean;
                                fileName = "ques_" + DateTime.Now.ToString("yyyy-MM-dd-hh-mm-ss-ffffff") + "_" + Request.Cookies["EmpID"].Value.ToString().Replace("-", "") + ".jpg";
                                saveToFolder(fileName, clean);
                            }
                            else
                            {
                                if (!(prevDiagram.Equals(clean)))
                                {
                                    prevDiagram = clean;
                                    fileName = "ques_" + DateTime.Now.ToString("yyyy-MM-dd-hh-mm-ss-ffffff") + "_" + Request.Cookies["EmpID"].Value.ToString().Replace("-", "") + ".jpg";
                                    saveToFolder(fileName, clean);
                                }
                            }
                            break;
                        case 4:
                            if (!(clean.Equals("NULL")))
                            {
                                choicesTxt = clean;

                            }
                            break;
                        case 5:
                            if (!(clean.Equals("NULL")))
                            {
                                choicesImg = "ch_" + DateTime.Now.ToString("yyyy-MM-dd-hh-mm-ss-ffffff") + Request.Cookies["EmpID"].Value.ToString().Replace("-", "") + ".jpg";
                                saveToFolder(choicesImg, clean);
                            }
                            break;
                        case 6: ans = clean; break;
                        case 7: schedule = clean; break;
                        case 8: examinee = clean; break;
                        case 9: limit = clean; break;
                        case 10: passingRate = clean; break;
                    }
                    count++;
                }


                if (!(choicesTxt.Equals("")))
                {
                    _tblques.choices = choicesTxt;
                }
                else if (!(choicesImg.Equals("")) && choicesTxt.Equals("")) {
                    _tblques.choices = "";
                    _tblques.choices_img = choicesImg;
                }
                else
                {
                    _tblques.choices = "";
                    _tblques.choices_img = "";
                }

                _tblques.category_id = Category;
                _tblques.exam_id = getExamId();
                _tblques.test_type = "Diagram";
                _tblques.title = Title;
                _tblques.general_instruction = instruction;
                _tblques.question = question;
                _tblques.image_name = fileName;
                _tblques.answer = ans;
                _tblques.department = Request.Cookies["Department"].Value.ToString();
                _tblques.added_by = Request.Cookies["Fullname"].Value.ToString();
                _tblques.date_added = Convert.ToString(DateTime.Now);
                _tblques.exam_schedule = schedule;
                _tblques.examinee = examinee;
                _tblques.time_limit = limit;
                _tblques.allow_access = Request.Cookies["EmpID"].Value.ToString().Replace("-", "");
                _tblques.passing_rate = passingRate;

                _questionaire.InsertQuestionaire(_tblques);
                _questionaire.Save();

            }


            return Json(JsonRequestBehavior.AllowGet);
        }

        public ActionResult saveEnumeration(string Title, int Category, List<string> Enumeration)
        {
            JavaScriptSerializer js = new JavaScriptSerializer();

            var output = js.Serialize(Enumeration);
            var parse = JArray.Parse(output);

            for (int i = 0; i < Enumeration.Count; i++)
            {
                var instruction = "";
                var question = "";
                var choices = "";
                var ans = "";
                var schedule = "";
                var examinee = "";
                var limit = "";
                var passingRate = "";
                var inAnyOrder = "";
                int count = 1;

                dynamic elements = JsonConvert.DeserializeObject(parse[i].ToString());

                foreach (var item in elements)
                {
                    string tmp = item.ToString();

                    var messy = Regex.Replace(tmp, @"\r\n?|\\n", Environment.NewLine);
                    var rem1 = messy.Substring(messy.IndexOf(":") + 2);

                    var rem2 = rem1.Substring(1, rem1.Length - 1);
                    var clean = rem2.Substring(0, rem2.Length - 1);

                    switch (count)
                    {
                        case 1: instruction = clean; break;
                        case 2: question = clean; break;
                        case 3: ans = clean; break;
                        case 4: schedule = clean; break;
                        case 5: examinee = clean; break;
                        case 6: limit = clean; break;
                        case 7: passingRate = clean; break;
                        case 8: inAnyOrder = clean; break;
                    }
                    count++;
                }

                _tblques.category_id = Category;
                _tblques.exam_id = getExamId();
                _tblques.test_type = "Enumeration";
                _tblques.title = Title;
                _tblques.general_instruction = instruction;
                _tblques.question = question;
                _tblques.choices = choices;
                _tblques.answer = ans;
                _tblques.in_any_order = inAnyOrder;
                _tblques.department = Request.Cookies["Department"].Value.ToString();
                _tblques.added_by = Request.Cookies["Fullname"].Value.ToString();
                _tblques.date_added = Convert.ToString(DateTime.Now);
                _tblques.exam_schedule = schedule;
                _tblques.examinee = examinee;
                _tblques.time_limit = limit;
                _tblques.allow_access = Request.Cookies["EmpID"].Value.ToString().Replace("-", "");
                _tblques.passing_rate = passingRate;

                _questionaire.InsertQuestionaire(_tblques);
                _questionaire.Save();
            }
            return Json(JsonRequestBehavior.AllowGet);
        }

        public ActionResult saveMatchingType(string Title, int Category, List<string> MatchingType)
        {
            JavaScriptSerializer js = new JavaScriptSerializer();

            var output = js.Serialize(MatchingType);
            var parse = JArray.Parse(output);

            for (int i = 0; i < MatchingType.Count; i++)
            {
                var instruction = "";
                var question = "";
                var choices = "";
                var ans = "";
                var schedule = "";
                var examinee = "";
                var limit = "";
                var passingRate = "";
                int count = 1;

                dynamic elements = JsonConvert.DeserializeObject(parse[i].ToString());

                foreach (var item in elements)
                {
                    string tmp = item.ToString();

                    var messy = Regex.Replace(tmp, @"\r\n?|\\n", Environment.NewLine);
                    var rem1 = messy.Substring(messy.IndexOf(":") + 2);

                    var rem2 = rem1.Substring(1, rem1.Length - 1);
                    var clean = rem2.Substring(0, rem2.Length - 1);

                    switch (count)
                    {
                        case 1: instruction = clean; break;
                        case 2: question = clean; break;
                        case 3: choices = clean; break;
                        case 4: ans = clean; break;
                        case 5: schedule = clean; break;
                        case 6: examinee = clean; break;
                        case 7: limit = clean; break;
                        case 8: passingRate = clean; break;
                    }

                    count++;
                }

                _tblques.category_id = Category;
                _tblques.exam_id = getExamId();
                _tblques.test_type = "Matching Type";
                _tblques.title = Title;
                _tblques.general_instruction = instruction;
                _tblques.question = question;
                _tblques.choices = choices;
                _tblques.answer = ans;
                _tblques.department = Request.Cookies["Department"].Value.ToString();
                _tblques.added_by = Request.Cookies["Fullname"].Value.ToString();
                _tblques.date_added = Convert.ToString(DateTime.Now);
                _tblques.exam_schedule = schedule;
                _tblques.examinee = examinee;
                _tblques.time_limit = limit;
                _tblques.allow_access = Request.Cookies["EmpID"].Value.ToString().Replace("-", "");
                _tblques.passing_rate = passingRate;

                _questionaire.InsertQuestionaire(_tblques);
                _questionaire.Save();
            }
            return Json(JsonRequestBehavior.AllowGet);
        }


        #endregion

        #region Category
        public ActionResult addNewCategory(string CategoryName)
        {
            var category = _category.GetCategories().Where(c => c.category_name.Contains(CategoryName)).FirstOrDefault();

            if (category == null)
            {
                _tblcategory.category_name = CategoryName;
                _tblcategory.department = Request.Cookies["Department"].Value.ToString();

                _category.InsertCategory(_tblcategory);
                _category.Save();

                var categories = _category.GetCategories().Max(x => x.category_id);
                return Json(categories, JsonRequestBehavior.AllowGet);
            }

            return Json(JsonRequestBehavior.AllowGet);

        }

        public ActionResult getMaxCategory()
        {
            var MaxCategory = _category.GetCategories().Max(c => c.category_id);

            return Json(MaxCategory, JsonRequestBehavior.AllowGet);

        }
        #endregion

        #region Generated code

        public ActionResult GetEmpDetails(string id)
        {
            var data = _employee.GetEmployees().Where(t => t.emp_id.Trim().Equals(id.Trim())).GroupBy(t => t.emp_id).Select(t => t.FirstOrDefault());
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetQuestionnaire(string term)
        {
            var data = _questionaire.GetQuestionaires().Where(t => t.title.ToLower().StartsWith(term.ToLower())).GroupBy(t => t.exam_id).Select(t => t.FirstOrDefault());
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetEmpID(string term)
        {
            var search = "g" + term;
            var data = _employee.GetEmployees().Where(e => e.emp_id.Replace("-", "").Trim().StartsWith(search.Replace("-", "").Trim())).GroupBy(e => e.emp_id).Select(e => e.FirstOrDefault());
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetFCId(string term)
        {
            var search = "g" + term;
            var data = _employee.GetEmployees().Where(e => e.emp_id.Replace("-", "").Trim().StartsWith(search.Replace("-", "").Trim()) && e.user_rights.Equals("Fullcontrol")).GroupBy(e => e.emp_id).Select(e => e.FirstOrDefault());
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Register(int? page)
        {
            var tmp = (from c in _codes.GetCodes()
                       orderby c.control_no ascending
                       select new UserRegistration()
                       {
                           EmpID = c.emp_id,
                           Fullname = c.fname + " " + c.lname,
                           Category = _category.GetCategories().Where(q => q.category_id == c.category_id).Select(q => q.category_name).LastOrDefault(),
                           ControlNo = c.control_no,
                       }).ToList();
            ViewBag.Categories = _category.GetCategories().ToList();
            var codes = tmp.GroupBy(a => a.ControlNo).Select(a => a.FirstOrDefault()).ToList();
            return View(codes.ToPagedList(page ?? 1, 50));
        }
        public ActionResult e_Registration(string examid, string empID, string fname, string mname, string lname, string dept, string cntrol_no, string isVisitor, string category)
        {
            tbl_unique_codes codes = new tbl_unique_codes();

            codes.exam_id = Convert.ToInt32(examid);
            codes.emp_id = empID;
            codes.fname = fname;
            codes.mname = mname;
            codes.lname = lname;
            codes.department = dept;
            codes.control_no = cntrol_no;
            codes.isVisitor = isVisitor;
            codes.category_id = Convert.ToInt32(category);

            _codes.InsertCodes(codes);
            _codes.Save();

            return Json(JsonRequestBehavior.AllowGet);
        }

        public ActionResult DisplayQuestionnaires(string categoryID)
        {
            var tmp = (from q in _questionaire.GetQuestionaires()
                       where q.category_id == Convert.ToInt32(categoryID)
                       select q);

            var questionnaires = tmp.GroupBy(a => a.exam_id).Select(a => a.FirstOrDefault()).ToList();

            return Json(questionnaires, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Import Excel File
        public ActionResult SaveExcel(List<string> Content, string ExamType, string Hr, string Min, string Rate, string Title, string Category, string Examinee, string Schedule)
        {

            var category_id = _category.GetCategories().Where(a => a.category_id.Equals(Convert.ToInt32(Category))).FirstOrDefault();

            JavaScriptSerializer js = new JavaScriptSerializer();

            var output = js.Serialize(Content);
            var parse = JArray.Parse(output);

            for (int i = 0; i < Content.Count; i++)
            {
                var instruction = "";
                var question = "";
                var choices = "";
                var ans = "";
                var inAnyOrder = "";
                int count = 1;

                dynamic elements = JsonConvert.DeserializeObject(parse[i].ToString());

                foreach (var item in elements)
                {
                    string tmp = item.ToString();

                    var messy = Regex.Replace(tmp, @"\r\n?|\\n", Environment.NewLine);
                    var rem1 = messy.Substring(messy.IndexOf(":") + 2);

                    var rem2 = rem1.Substring(1, rem1.Length - 1);
                    var clean = rem2.Substring(0, rem2.Length - 1);

                    if (ExamType.ToLower().Equals("multiple choice") || ExamType.ToLower().Equals("matching type"))
                    {
                        switch (count)
                        {
                            case 1: instruction = clean; break;
                            case 2: question = clean; break;
                            case 3: choices = clean; break;
                            case 4: ans = clean; break;
                        }
                    }
                    else
                    {
                        if (ExamType.ToLower().Equals("enumeration"))
                        {

                            switch (count)
                            {
                                case 1: instruction = clean; break;
                                case 2: question = clean; break;
                                case 3: ans = clean; break;
                                case 4: inAnyOrder = clean; break;
                            }
                        }
                        else
                        {
                            switch (count)
                            {
                                case 1: instruction = clean; break;
                                case 2: question = clean; break;
                                case 3: ans = clean; break;
                            }
                        }
                    }
                    count++;
                }

                _tblques.category_id = category_id.category_id;
                _tblques.exam_id = getExamId();
                _tblques.test_type = ExamType;
                _tblques.title = Title.Trim();
                _tblques.general_instruction = instruction;
                _tblques.question = question;
                _tblques.choices = choices;
                _tblques.answer = ans;
                _tblques.department = Request.Cookies["Department"].Value.ToString();
                _tblques.added_by = Request.Cookies["Fullname"].Value.ToString();
                _tblques.date_added = Convert.ToString(DateTime.Now);
                _tblques.exam_schedule = Schedule;
                _tblques.examinee = Examinee;
                _tblques.time_limit = Hr + ";" + Min;
                _tblques.allow_access = Request.Cookies["EmpID"].Value.ToString().Replace("-", "");
                _tblques.passing_rate = Rate;
                _tblques.in_any_order = inAnyOrder;

                _questionaire.InsertQuestionaire(_tblques);
                _questionaire.Save();
            }
            return Json(JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Images to folder

        public void saveToFolder(string filename, string strBase64)
        {
            string folderPath = Server.MapPath("~/Diagrams/");

            string imagePath = folderPath + filename;

            string cleandata = strBase64; // base64 string data
            byte[] data = System.Convert.FromBase64String(cleandata);

            MemoryStream ms = new MemoryStream(data);
            System.Drawing.Image img = System.Drawing.Image.FromStream(ms);
            img.Save(imagePath, System.Drawing.Imaging.ImageFormat.Jpeg);
        }

        public ActionResult replaceImage(string ImageName, string StrBase64)
        {
            string fullPath = Request.MapPath("~/Diagrams/" + ImageName);
            
            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
                saveToFolder(ImageName, StrBase64);
            }
            return View();
        }

        #endregion
    }
}