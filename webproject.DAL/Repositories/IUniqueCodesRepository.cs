using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webproject.DAL.DB;

namespace webproject.DAL.Repositories
{
    public interface IUniqueCodesRepository : IDisposable
    {
        IEnumerable<tbl_unique_codes> GetCodes();
        tbl_unique_codes GetCodesByID(int id);
        void InsertCodes(tbl_unique_codes codes);
        void DeleteCodes(int id);
        void UpdateCodes(tbl_unique_codes codes);
        void Save();

    }
}
