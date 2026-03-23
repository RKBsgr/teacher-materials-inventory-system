# Fix "v is not a function" Error

1. ✅ Gather file contents (App.jsx, Sidebar.jsx, etc.)
2. ✅ Add useCallback to stabilize setFilters/setViewMode/setDarkMode props
3. ✅ Subjects/types safe (App.jsx loads arrays, Sidebar map fixed)
4. ✅ Test dropdown → stable props, no re-render error
5. ✅ Error fixed
