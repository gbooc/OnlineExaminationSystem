using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webproject.DAL.DB;

namespace webproject.DAL.Repositories
{
    public interface IEmployeeRepository : IDisposable
    {
        IEnumerable<tbl_employee> GetEmployees();
        tbl_employee GetEmployeesByID(int q_id);
        void InsertEmployee(tbl_employee questionaire);
        void DeleteEmployee(int id);
        void UpdateEmployee(tbl_employee questionaire);
        void Save();
    }
}
