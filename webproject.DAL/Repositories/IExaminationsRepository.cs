using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webproject.DAL.DB;

namespace webproject.DAL.Repositories
{
    public interface IExaminationsRepository : IDisposable
    {
        IEnumerable<tbl_examinations> GetExaminations();
        tbl_examinations GetExaminationsByID(int q_id);
        void InsertExaminations(tbl_examinations questionaire);
        void DeleteExaminations(int id);
        void UpdateExaminations(tbl_examinations questionaire);
        IEnumerable<sp_summary_result_of_exam_Result> ExaminationResultsSummary(int ExamId, string Type);
        IEnumerable<sp_exam_result_by_subj_Result> ExamResultsBySubject(string AddedBy, string HasAccess);
        IEnumerable<sp_employee_exam_list_Result> EmployeeResultsList(string AddedBy, string HasAccess);
        IEnumerable<sp_examinee_exam_history_Result> ExamineeHistory(string EmpID, int ExamID);
        IEnumerable<sp_enumrations_answer_Result> EnumerationAnswer(int ExamID);
        void Save();
    }
}
