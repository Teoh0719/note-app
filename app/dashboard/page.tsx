"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { 
  collection, addDoc, query, where, onSnapshot, 
  deleteDoc, doc, updateDoc 
} from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: number;
  color?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("blue");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const colorThemes: Record<string, { bg: string, bar: string, text: string }> = {
    blue: { bg: 'bg-blue-500', bar: 'from-blue-400 to-indigo-500', text: 'text-gray-800 group-hover:text-blue-700' },
    purple: { bg: 'bg-purple-500', bar: 'from-purple-400 to-fuchsia-500', text: 'text-gray-800 group-hover:text-purple-700' },
    green: { bg: 'bg-emerald-500', bar: 'from-emerald-400 to-teal-500', text: 'text-gray-800 group-hover:text-emerald-700' },
    rose: { bg: 'bg-rose-500', bar: 'from-rose-400 to-red-500', text: 'text-gray-800 group-hover:text-rose-700' },
    orange: { bg: 'bg-orange-500', bar: 'from-orange-400 to-amber-500', text: 'text-gray-800 group-hover:text-orange-700' },
  };

  // 1. Protect the route & get user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Fetch only the logged-in user's notes
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "notes"), where("userId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Cast the returned data as a Note array
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      
      // Now TypeScript knows that 'createdAt' exists!
      notesData.sort((a, b) => b.createdAt - a.createdAt);
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Handle Add / Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, "notes", editingId), {
          title,
          content,
          color, // Save color on update
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "notes"), {
          userId: user.uid,
          title,
          content,
          color, // Save color on create
          createdAt: new Date().getTime(),
        });
      }
      setTitle("");
      setContent("");
      setColor("blue"); // Reset color
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving note: ", error);
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      await deleteDoc(doc(db, "notes", id));
    }
  };

  // 5. Populate form for Editing
  const handleEdit = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color || "blue");
    setEditingId(note.id);
    setIsFormOpen(true); // Open the form when editing a note
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-black">Loading...</div>;
  if (!user) return null; // Prevent flash of content before redirect

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">My Notes</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Note Creation/Edit Area */}
        <div className="md:col-span-1 h-fit">
          {!isFormOpen ? (
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
            >
              <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300 mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-semibold">Create New Note</span>
            </button>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
              <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Note" : "Create a Note"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Color Picker */}
                <div className="flex gap-3 px-1 pb-2">
                  {Object.keys(colorThemes).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-all duration-200 ${colorThemes[c].bg} ${
                        color === c ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={c}
                    />
                  ))}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Write your note here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={5}
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white font-medium p-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {editingId ? "Update Note" : "Save Note"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingId(null);
                      setTitle("");
                      setContent("");
                    }}
                    className="px-4 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Notes Display Grid */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-800">Your Notes</h2>
          
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white/50 border border-gray-200 border-dashed rounded-2xl text-center">
              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 font-medium">You haven't created any notes yet.</p>
              <p className="text-gray-400 text-sm mt-1">Click the button on the left to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {notes.map((note) => {
                const theme = colorThemes[note.color || 'blue']; // Fallback to blue if no color exists
                
                return (
                  <div 
                    key={note.id} 
                    className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
                  >
                    {/* Dynamic Top Color Bar */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.bar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    {/* Dynamic Title Text Color on Hover */}
                    <h3 className={`font-bold text-xl mb-3 tracking-tight transition-colors duration-300 ${theme.text}`}>
                      {note.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 flex-grow whitespace-pre-wrap leading-relaxed">{note.content}</p>
                    
                    {/* Action buttons (Fade in on hover) */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => handleEdit(note)} 
                        className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(note.id)} 
                        className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}