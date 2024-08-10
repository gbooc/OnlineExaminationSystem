using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webproject.DAL.DB;

namespace webproject.DAL.Repositories
{
    public interface IQuestionaireRepository: IDisposable
    {
        IEnumerable<tbl_questionnaire> GetQuestionaires();
        tbl_questionnaire GetQuestionByID(int q_id);
        void InsertQuestionaire(tbl_questionnaire questionaire);
        void DeleteQuestionaire(int id);
        void UpdateQuestionaire(tbl_questionnaire questionaire);
        void Save();
    }
}
