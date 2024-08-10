using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webproject.DAL.DB;

namespace webproject.DAL.Repositories
{
    public class UniqueCodesRepository : IUniqueCodesRepository, IDisposable
    {
        private OESEntities context;

        public UniqueCodesRepository(OESEntities context)
        {
            this.context = context;
        }

        public IEnumerable<tbl_unique_codes> GetCodes()
        {
            return context.tbl_unique_codes.ToList();
        }

        public tbl_unique_codes GetCodesByID(int code)
        {
            return context.tbl_unique_codes.Find(code);
        }

        public void InsertCodes(tbl_unique_codes result)
        {
            context.tbl_unique_codes.Add(result);
        }

        public void DeleteCodes(int id)
        {
            tbl_unique_codes result = context.tbl_unique_codes.Find(id);
            context.tbl_unique_codes.Remove(result);
        }

        public void UpdateCodes(tbl_unique_codes result)
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
