using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webproject.DAL.DB;

namespace webproject.DAL.Repositories
{
    public class ExaminationsRepository : IExaminationsRepository, IDisposable
    {
         private OESEntities context;

         public ExaminationsRepository(OESEntities context)
        {
            this.context = context;
        }

         public IEnumerable<tbl_examinations> GetExaminations()
        {
            return context.tbl_examinations.ToList();
        }

         public tbl_examinations GetExaminationsByID(int questionaire)
        {
            return context.tbl_examinations.Find(questionaire);
        }

         public void InsertExaminations(tbl_examinations result)
        {
            context.tbl_examinations.Add(result);
        }

         public void DeleteExaminations(int id)
        {
            tbl_examinations result = context.tbl_examinations.Find(id);
            context.tbl_examinations.Remove(result);
        }

         public void UpdateExaminations(tbl_examinations result)
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

        #region stored procedure
        public IEnumerable<sp_summary_result_of_exam_Result> ExaminationResultsSummary(int ExamID, string Type)
        {
            return context.sp_summary_result_of_exam(ExamID,Type).ToList();
        }
        public IEnumerable<sp_exam_result_by_subj_Result> ExamResultsBySubject(string AddedBy, string HasAccess)
        {
            return context.sp_exam_result_by_subj(AddedBy, HasAccess).ToList();
        }
        public IEnumerable<sp_employee_exam_list_Result> EmployeeResultsList(string AddedBy, string HasAccess)
        {
            return context.sp_employee_exam_list(AddedBy, HasAccess).ToList();
        }
        public IEnumerable<sp_examinee_exam_history_Result> ExamineeHistory(string EmpID, int ExamID)
        {
            return context.sp_examinee_exam_history(EmpID, ExamID).ToList();
        }
        public IEnumerable<sp_enumrations_answer_Result> EnumerationAnswer(int ExamID)
        {
            return context.sp_enumrations_answer(ExamID).ToList();
        }
        #endregion
    }
}
