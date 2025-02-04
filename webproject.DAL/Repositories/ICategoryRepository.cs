﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webproject.DAL.DB;

namespace webproject.DAL.Repositories
{
    public interface ICategoryRepository : IDisposable
    {
        IEnumerable<tbl_category> GetCategories();
        tbl_category GetCategoriesByID(int q_id);
        void InsertCategory(tbl_category questionaire);
        void DeleteCategory(int id);
        void UpdateCategory(tbl_category questionaire);
        void Save();
    }
}
