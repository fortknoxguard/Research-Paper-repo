import { supabase } from "./supabase.js"; 

updateAdminStats();

async function updateAdminStats() {

    const { count: approvedCount } = await supabase
        .from('research_papers')
        .select('*', { count: 'exact', head: true }) 
        .eq('status', 'approved');


    const { count: pendingCount } = await supabase
        .from('research_papers')
        .select('*', { count: 'exact', head: true }) 
        .eq('status', 'pending');


    if (document.getElementById('total-approved-count')) {
        document.getElementById('total-approved-count').innerText = approvedCount || 0;
    }
    

    if (document.getElementById('total-pending-count')) {
        document.getElementById('total-pending-count').innerText = pendingCount || 0;
    }
}
