using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webproject.DAL.DB;

namespace webproject.DAL.Repositories
{
    public class CategoryRepository : ICategoryRepository, IDisposable
    {
         private OESEntities context;

         public CategoryRepository(OESEntities context)
        {
            this.context = context;
        }

         public IEnumerable<tbl_category> GetCategories()
        {
            return context.tbl_category.ToList();
        }

         public tbl_category GetCategoriesByID(int questionaire)
        {
            return context.tbl_category.Find(questionaire);
        }

         public void InsertCategory(tbl_category result)
        {
            context.tbl_category.Add(result);
        }

         public void DeleteCategory(int id)
        {
            tbl_category result = context.tbl_category.Find(id);
            context.tbl_category.Remove(result);
        }

         public void UpdateCategory(tbl_category result)
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
