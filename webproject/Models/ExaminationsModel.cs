using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace webproject.Models
{
    public class ExaminationsModel
    {
        public string ID { get; set; }
        public int? ExamID { get; set; }
        public string Category { get; set; }
        public string Title { get; set; }
        public string Score { get; set; }
        public string DateAnswered { get; set; }

    }

    public class TakeExamModel
    {
        public int OP_ID { get; set; }

        public int? ExamID { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string TestType { get; set; }
        public string GeneralInstruction { get; set; }
        public string Question { get; set; }
        public string Choices { get; set; }
        public string Answer { get; set; }
        public string hrLimit { get; set; }
        public string minLimit { get; set; }
        public string today { get; set; }
        public string DiagramImgName { get; set; }
        public string ChoicesImgName { get; set; }
        public string InAnyOrder { get; set; }
        public string Points { get; set; }
    }

    public class ExamHistory
    {
        public int? OP_ID { get; set; }

        public int? ExamID { get; set; }
        public string EmpID { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string TestType { get; set; }
        public string GeneralInstruction { get; set; }
        public string Question { get; set; }
        public string Choices { get; set; }
        public string UserAnswer { get; set; }
        public string CorrectAnswer { get; set; }

        public string Attempt { get; set; }
        public string Score { get; set; }
        public string TotalScore { get; set; }
        public string Examinee { get; set; }
        public string PassingRate { get; set; }
        public string EssayFlag { get; set; }
        public string UserControl { get; set; }
        public string Duration { get; set; }
        public string ImgName { get; set; }
        public string ChoicesImgName { get; set; }
        public string InAnyOrder { get; set; }
        public string InAnyOrderAns { get; set; }
        public string Points { get; set; }
        public string EssayPts { get; set; }

    }

    public class AutoExamList
    {
        public int ID { get; set; }
        public int examID { get; set; }
        public string EmpID { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string ControlNo { get; set; }
        public string Title { get; set; }
        public string TimeLimit { get; set; }
        public string Hr { get; set; }
        public string Min { get; set; }
        public string Status { get; set; }
        public string IsVisitor { get; set; }
    }
}