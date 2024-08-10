using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webproject.DAL.DB;

namespace webproject.DAL.Repositories
{
    public class EmployeeRepository : IEmployeeRepository, IDisposable 
    {
         private OESEntities context;

         public EmployeeRepository(OESEntities context)
        {
            this.context = context;
        }

         public IEnumerable<tbl_employee> GetEmployees()
        {
            return context.tbl_employee.ToList();
        }

         public tbl_employee GetEmployeesByID(int questionaire)
        {
            return context.tbl_employee.Find(questionaire);
        }

         public void InsertEmployee(tbl_employee result)
        {
            context.tbl_employee.Add(result);
        }

         public void DeleteEmployee(int id)
        {
            tbl_employee result = context.tbl_employee.Find(id);
            context.tbl_employee.Remove(result);
        }

         public void UpdateEmployee(tbl_employee result)
        {
            context.Entry(result).State = EntityState.Modified;
        }

        public void Save()
        {
            context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
