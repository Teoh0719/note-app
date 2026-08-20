import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-blue-600">
          Capture Your Thoughts, Securely.
        </h1>
        
        <p className="text-xl text-gray-600">
          The minimalist note-taking app designed for focus. Write down your ideas, edit them on the fly, and access them from anywhere. Your notes are private and locked to your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          {/* Primary Button: Expanding Outer Glow/Ring Flow */}
          <Link 
            href="/register" 
            className="relative group px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg transition-colors shadow-sm"
          >
            Get Started for Free
            {/* The line that flows outward from the border */}
            <span className="absolute inset-0 rounded-lg ring-0 ring-blue-500 opacity-0 group-hover:ring-4 group-hover:ring-offset-2 group-hover:opacity-50 transition-all duration-300 ease-out"></span>
          </Link>
          
          {/* Secondary Button: Center-Out Flowing Underline */}
          <Link 
            href="/login" 
            className="relative group px-8 py-3 text-lg font-medium text-blue-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm overflow-hidden"
          >
            <span className="relative z-10">Login to Dashboard</span>
            {/* The line that draws itself smoothly from the center to the edges */}
            <span className="absolute bottom-0 left-1/2 w-0 h-[3px] bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out"></span>
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-2">Simple & Clean</h3>
          <p className="text-gray-600">A distraction-free interface so you can focus entirely on what you are writing.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-2">Absolute Privacy</h3>
          <p className="text-gray-600">Your notes are tied to your account. No one else can view, edit, or delete your content.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-2">Access Anywhere</h3>
          <p className="text-gray-600">Securely log in from any device to view your dashboard and manage your notes.</p>
        </div>
      </div>
    </main>
  );
}