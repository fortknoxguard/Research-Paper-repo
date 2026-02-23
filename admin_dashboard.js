import { supabase } from "./supabase.js";

async function updateAdminStats() {
    console.log("Admin script triggered...");

    try {
        const { count, error } = await supabase
            .from('research_papers')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved');

        if (error) throw error;

        console.log("Admin count fetched:", count);
        
        const countEl = document.getElementById('total-approved-count');
        if (countEl) {
            countEl.innerText = count || 0;
        }
    } catch (err) {
        console.error("Admin Dashboard Error:", err.message);
    }
}

// Run immediately
updateAdminStats();
