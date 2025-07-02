export default function CursorLoading() {
    return (
        <div className="p-6 w-full rounded-xl bg-[#1c1c1c] border border-purple-700/40 animate-pulse">
            
            <div className="h-8 w-48 mb-4 rounded bg-purple-600/30"></div>

            <div className="h-4 w-64 mb-6 rounded bg-purple-600/20"></div>

            <div className="h-screen rounded border-2 border-purple-600/40 grid grid-cols-20 grid-rows-20 gap-[1px] bg-[#121212]">
                {[...Array(400)].map((_, i) => (
                    <div key={i} className="bg-purple-700/10 rounded-sm"></div>
                ))}
            </div>
        </div>
    );
}
