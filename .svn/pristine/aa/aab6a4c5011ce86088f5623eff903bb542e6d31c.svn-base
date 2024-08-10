using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webproject.DAL.DB;

namespace webproject.DAL.Repositories
{
    public class QuestionaireRepository : IQuestionaireRepository , IDisposable
    {
        private OESEntities context;

        public QuestionaireRepository(OESEntities context)
        {
            this.context = context;
        }

        public IEnumerable<tbl_questionnaire> GetQuestionaires()
        {
            return context.tbl_questionnaire.ToList();
        }

        public tbl_questionnaire GetQuestionByID(int questionaire)
        {
            return context.tbl_questionnaire.Find(questionaire);
        }

        public void InsertQuestionaire(tbl_questionnaire result)
        {
            context.tbl_questionnaire.Add(result);
        }

        public void DeleteQuestionaire(int id)
        {
            tbl_questionnaire result = context.tbl_questionnaire.Find(id);
            context.tbl_questionnaire.Remove(result);
        }

        public void UpdateQuestionaire(tbl_questionnaire result)
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
