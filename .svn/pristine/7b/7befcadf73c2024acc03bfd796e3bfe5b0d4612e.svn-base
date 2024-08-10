using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace webproject.Models
{
    public class UserDetails
    {
        
       public string FirstName { get; set; }
       public string LastName { get; set; }
       
       [Required]
       public string ExamCode { get; set; }
        public string EmployeID { get; set; }
        public string Password { get; set; }
        public string UserRights { get; set; }

    }

    public class UserRegistration
    {
        public string EmpID { get; set; }
        public string Fullname { get; set; }
        public string  Department { get; set; }
        public string  UserRights { get; set; }
        public string Category { get; set; }
        public string ControlNo { get; set; }
    }

    public class UserSearch
    {
        public int? ExamID { get; set; }
        public string Title { get; set; }
        public string EmpID { get; set; }
        public string Fullname { get; set; }
        public string Rights { get; set; }
        public string IsVisitor { get; set; }
        public string Attempt { get; set; }
    }
}