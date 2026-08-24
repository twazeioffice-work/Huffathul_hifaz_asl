import os

def fix_logout_in_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We want to replace the manual cookie clearing with a fetch call
    # find handleLogout
    old_func = """  const handleLogout = () => {
    document.cookie = "access_token=; Max-Age=0; path=/";
    document.cookie = "__Host-Secure-Token=; Max-Age=0; path=/; Secure";
    window.location.href = "/login";
  };"""

    new_func = """  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    // Also clear them locally just in case
    document.cookie = "access_token=; Max-Age=0; path=/";
    document.cookie = "__Host-Secure-Token=; Max-Age=0; path=/; Secure";
    window.location.href = "/login";
  };"""
    
    if old_func in content:
        content = content.replace(old_func, new_func)
    
    # In TopNavigationBar.tsx it might be inline
    inline_old = """                onClick={() => {
                  document.cookie = "access_token=; Max-Age=0; path=/";
                  document.cookie = "__Host-Secure-Token=; Max-Age=0; path=/; Secure";
                  window.location.href = "/login";
                }}"""
    
    inline_new = """                onClick={async () => {
                  try { await fetch('/api/v1/auth/logout', { method: 'POST' }); } catch (e) {}
                  document.cookie = "access_token=; Max-Age=0; path=/";
                  document.cookie = "__Host-Secure-Token=; Max-Age=0; path=/; Secure";
                  window.location.href = "/login";
                }}"""
    
    if inline_old in content:
        content = content.replace(inline_old, inline_new)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

fix_logout_in_file(r"E:\Huffathul Hifaaz_asl\apps\internal-erp\src\components\layout\AppShell.tsx")
fix_logout_in_file(r"E:\Huffathul Hifaaz_asl\apps\internal-erp\src\components\navigation\TopNavigationBar.tsx")
print("Logout fixed in layout and navigation")
