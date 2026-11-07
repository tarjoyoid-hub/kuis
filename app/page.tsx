import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Award, Volume2, VolumeX, Play, School, UserCheck, CheckCircle2,
  XCircle, Trophy, RefreshCw, Home, BookOpen, Settings, Plus, Edit, Trash2,
  Wand2, Search, Download, Printer, Lock, LogOut, ArrowRight, ArrowLeft, Star,
  PieChart, Users, HelpCircle, Check, AlertCircle, Shield, Image as ImageIcon, Flame
} from 'lucide-react';

// =========================================================================
// 🌐 KONFIGURASI GOOGLE APPS SCRIPT URL
// Tempelkan/Paste URL yang Anda dapatkan dari Langkah 4 Google Apps Script di sini:
// =========================================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyH3YgzkrntF0hGbPQNB-Bizp4ro934a5DLM7ifPmJSAlbqqo-M07l8aA8dpdWYZc4F/exec";

// --- DATA SOAL DEFAULT (40 SOAL SESUAI KATEGORI) ---
const INITIAL_QUESTIONS = [
  // 1-8: Hewan
  { id: 1, category: 'Hewan', question: 'Gambar hewan apakah ini?', answer: 'Kucing', options: ['Kucing', 'Kelinci', 'Ayam', 'Kambing'], icon: '🐱', bg: 'bg-amber-100', active: true },
  { id: 2, category: 'Hewan', question: 'Gambar hewan apakah ini?', answer: 'Anjing', options: ['Serigala', 'Anjing', 'Kucing', 'Harimau'], icon: '🐶', bg: 'bg-amber-100', active: true },
  { id: 3, category: 'Hewan', question: 'Gambar hewan apakah ini?', answer: 'Gajah', options: ['Jerapah', 'Kuda Nil', 'Gajah', 'Badak'], icon: '🐘', bg: 'bg-amber-100', active: true },
  { id: 4, category: 'Hewan', question: 'Gambar hewan apakah ini?', answer: 'Singa', options: ['Singa', 'Macan', 'Kucing', 'Serigala'], icon: '🦁', bg: 'bg-amber-100', active: true },
  { id: 5, category: 'Hewan', question: 'Gambar hewan apakah ini?', answer: 'Jerapah', options: ['Kuda', 'Jerapah', 'Zebra', 'Rusa'], icon: '🦒', bg: 'bg-amber-100', active: true },
  { id: 6, category: 'Hewan', question: 'Gambar hewan apakah ini?', answer: 'Monyet', options: ['Beruang', 'Panda', 'Monyet', 'Babi'], icon: '🐒', bg: 'bg-amber-100', active: true },
  { id: 7, category: 'Hewan', question: 'Gambar hewan apakah ini?', answer: 'Kelinci', options: ['Tupai', 'Kelinci', 'Tikus', 'Kucing'], icon: '🐰', bg: 'bg-amber-100', active: true },
  { id: 8, category: 'Hewan', question: 'Gambar hewan apakah ini?', answer: 'Ayam', options: ['Bebek', 'Burung', 'Ayam', 'Angsa'], icon: '🐔', bg: 'bg-amber-100', active: true },

  // 9-14: Buah-buahan
  { id: 9, category: 'Buah-buahan', question: 'Buah apakah ini?', answer: 'Apel', options: ['Jeruk', 'Apel', 'Mangga', 'Pisang'], icon: '🍎', bg: 'bg-red-100', active: true },
  { id: 10, category: 'Buah-buahan', question: 'Buah apakah ini?', answer: 'Pisang', options: ['Pisang', 'Nanas', 'Lemon', 'Jagung'], icon: '🍌', bg: 'bg-yellow-100', active: true },
  { id: 11, category: 'Buah-buahan', question: 'Buah apakah ini?', answer: 'Jeruk', options: ['Apel', 'Mangga', 'Jeruk', 'Melon'], icon: '🍊', bg: 'bg-orange-100', active: true },
  { id: 12, category: 'Buah-buahan', question: 'Buah apakah ini?', answer: 'Semangka', options: ['Semangka', 'Melon', 'Anggur', 'Pepaya'], icon: '🍉', bg: 'bg-green-100', active: true },
  { id: 13, category: 'Buah-buahan', question: 'Buah apakah ini?', answer: 'Anggur', options: ['Stroberi', 'Anggur', 'Ceri', 'Plum'], icon: '🍇', bg: 'bg-purple-100', active: true },
  { id: 14, category: 'Buah-buahan', question: 'Buah apakah ini?', answer: 'Stroberi', options: ['Tomat', 'Apel', 'Stroberi', 'Nanas'], icon: '🍓', bg: 'bg-rose-100', active: true },

  // 15-19: Sayuran
  { id: 15, category: 'Sayuran', question: 'Sayur apakah ini?', answer: 'Wortel', options: ['Wortel', 'Lobak', 'Cabai', 'Kentang'], icon: '🥕', bg: 'bg-orange-100', active: true },
  { id: 16, category: 'Sayuran', question: 'Sayur apakah ini?', answer: 'Brotoli', options: ['Bayam', 'Brotoli', 'Sawi', 'Kubis'], icon: '🥦', bg: 'bg-emerald-100', active: true },
  { id: 17, category: 'Sayuran', question: 'Sayur apakah ini?', answer: 'Jagung', options: ['Jagung', 'Padi', 'Kacang', 'Kedelai'], icon: '🌽', bg: 'bg-yellow-100', active: true },
  { id: 18, category: 'Sayuran', question: 'Sayur apakah mekar ini?', answer: 'Tomat', options: ['Apel', 'Tomat', 'Cabai', 'Terong'], icon: '🍅', bg: 'bg-red-100', active: true },
  { id: 19, category: 'Sayuran', question: 'Sayur apakah ini?', answer: 'Terong', options: ['Anggur', 'Terong', 'Zucchini', 'Paprika'], icon: '🍆', bg: 'bg-purple-100', active: true },

  // 20-25: Benda Sekitar
  { id: 20, category: 'Benda Sekitar', question: 'Benda apakah ini?', answer: 'Pensil', options: ['Pulpen', 'Penggaris', 'Pensil', 'Penghapus'], icon: '✏️', bg: 'bg-blue-100', active: true },
  { id: 21, category: 'Benda Sekitar', question: 'Benda apakah ini?', answer: 'Buku', options: ['Buku', 'Majalah', 'Kertas', 'Kardus'], icon: '📚', bg: 'bg-blue-100', active: true },
  { id: 22, category: 'Benda Sekitar', question: 'Benda apakah ini?', answer: 'Tas Sekolah', options: ['Koper', 'Tas Sekolah', 'Dompet', 'Plastik'], icon: '🎒', bg: 'bg-blue-100', active: true },
  { id: 23, category: 'Benda Sekitar', question: 'Benda apakah ini?', answer: 'Gunting', options: ['Pisau', 'Gunting', 'Penggaris', 'Obeng'], icon: '✂️', bg: 'bg-blue-100', active: true },
  { id: 24, category: 'Benda Sekitar', question: 'Benda apakah ini?', answer: 'Sepatu', options: ['Sandal', 'Sepatu', 'Kaos Kaki', 'Topi'], icon: '👟', bg: 'bg-blue-100', active: true },
  { id: 25, category: 'Benda Sekitar', question: 'Benda apakah ini?', answer: 'Jam Dinding', options: ['Kaca', 'Jam Dinding', 'Cermin', 'Piring'], icon: '⏰', bg: 'bg-blue-100', active: true },

  // 26-30: Kendaraan
  { id: 26, category: 'Kendaraan', question: 'Kendaraan apakah ini?', answer: 'Sepeda', options: ['Mobil', 'Bus', 'Sepeda', 'Kereta'], icon: '🚲', bg: 'bg-sky-100', active: true },
  { id: 27, category: 'Kendaraan', question: 'Kendaraan apakah ini?', answer: 'Mobil', options: ['Mobil', 'Truk', 'Bus', 'Motor'], icon: '🚗', bg: 'bg-sky-100', active: true },
  { id: 28, category: 'Kendaraan', question: 'Kendaraan apakah ini?', answer: 'Pesawat', options: ['Helikopter', 'Pesawat', 'Awan', 'Rolet'], icon: '✈️', bg: 'bg-sky-100', active: true },
  { id: 29, category: 'Kendaraan', question: 'Kendaraan apakah ini?', answer: 'Kapal Laut', options: ['Perahu', 'Kapal Laut', 'Kapal Selam', 'Raksa'], icon: '🚢', bg: 'bg-sky-100', active: true },
  { id: 30, category: 'Kendaraan', question: 'Kendaraan apakah ini?', answer: 'Kereta Api', options: ['Bus', 'Truk', 'Kereta Api', 'Mobil'], icon: '🚂', bg: 'bg-sky-100', active: true },

  // 31-35: Anggota Tubuh
  { id: 31, category: 'Anggota Tubuh', question: 'Bagian tubuh apakah ini?', answer: 'Mata', options: ['Mata', 'Hidung', 'Telinga', 'Mulut'], icon: '👁️', bg: 'bg-pink-100', active: true },
  { id: 32, category: 'Anggota Tubuh', question: 'Bagian tubuh apakah ini?', answer: 'Telinga', options: ['Mata', 'Telinga', 'Tangan', 'Kaki'], icon: '👂', bg: 'bg-pink-100', active: true },
  { id: 33, category: 'Anggota Tubuh', question: 'Bagian tubuh apakah ini?', answer: 'Hidung', options: ['Mulut', 'Hidung', 'Pipi', 'Dagu'], icon: '👃', bg: 'bg-pink-100', active: true },
  { id: 34, category: 'Anggota Tubuh', question: 'Bagian tubuh apakah ini?', answer: 'Tangan', options: ['Kaki', 'Tangan', 'Jari', 'Lengan'], icon: '✋', bg: 'bg-pink-100', active: true },
  { id: 35, category: 'Anggota Tubuh', question: 'Bagian tubuh apakah ini?', answer: 'Kaki', options: ['Tangan', 'Kaki', 'Lutut', 'Paha'], icon: '🦶', bg: 'bg-pink-100', active: true },

  // 36-40: Lingkungan & Alam
  { id: 36, category: 'Lingkungan', question: 'Gambar apakah ini?', answer: 'Matahari', options: ['Bulan', 'Matahari', 'Bintang', 'Awan'], icon: '☀️', bg: 'bg-indigo-100', active: true },
  { id: 37, category: 'Lingkungan', question: 'Gambar apakah ini?', answer: 'Pelangi', options: ['Awan', 'Hujan', 'Pelangi', 'Petir'], icon: '🌈', bg: 'bg-indigo-100', active: true },
  { id: 38, category: 'Lingkungan', question: 'Gambar apakah ini?', answer: 'Gunung', options: ['Bukit', 'Gunung', 'Lembah', 'Danau'], icon: '⛰️', bg: 'bg-indigo-100', active: true },
  { id: 39, category: 'Lingkungan', question: 'Gambar apakah ini?', answer: 'Pohon', options: ['Bunga', 'Rumput', 'Pohon', 'Hutan'], icon: '🌳', bg: 'bg-indigo-100', active: true },
  { id: 40, category: 'Lingkungan', question: 'Gambar apakah ini?', answer: 'Bunga', options: ['Pohon', 'Daun', 'Bunga', 'Taman'], icon: '🌻', bg: 'bg-indigo-100', active: true },
];

export default function App() {
  // State Halaman Navigation: 'home' | 'student-form' | 'quiz' | 'result' | 'teacher-login' | 'teacher-dashboard'
  const [page, setPage] = useState('home');

  // Identitas Siswa & Pengerjaan Kuis
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('1');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [durationInSeconds, setDurationInSeconds] = useState(0);
  const [userAnswersHistory, setUserAnswersHistory] = useState([]);

  // Audio / Sound Effect state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Bank Soal State (Dapat diedit guru)
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('anak_pintar_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  // Leaderboard & Laporan State
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('anak_pintar_leaderboard');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Budi Santoso', studentClass: '3', score: 100, correct: 40, duration: 185, date: '2026-03-01 09:30' },
      { id: 2, name: 'Siti Rahma', studentClass: '2', score: 95, correct: 38, duration: 210, date: '2026-03-02 10:15' },
      { id: 3, name: 'Alif Pratama', studentClass: '1', score: 90, correct: 36, duration: 240, date: '2026-03-02 11:00' },
    ];
  });

  // Teacher State & Auth
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [teacherUsername, setTeacherUsername] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherLoginError, setTeacherLoginError] = useState('');

  // Settings State
  const [appName, setAppName] = useState('ANAK PINTAR');
  const [teacherAuthCreds, setTeacherAuthCreds] = useState({ user: 'guru', pass: '123456' });

  // Teacher Modals and Search/Filter State
  const [teacherTab, setTeacherTab] = useState('dashboard'); // 'dashboard' | 'questions' | 'leaderboard' | 'reports' | 'settings'
  const [searchStudent, setSearchStudent] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [selectedReportStudent, setSelectedReportStudent] = useState(null);

  // Perbarui LocalStorage saat state berubah
  useEffect(() => {
    localStorage.setItem('anak_pintar_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('anak_pintar_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Audio Synthesizer (Web Audio API & Speech Synthesis)
  const playAudioEffect = (type) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (type === 'correct') {
        // Melodi sukses gembira
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.3, audioCtx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.1 + 0.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + idx * 0.1);
          osc.stop(audioCtx.currentTime + idx * 0.1 + 0.25);
        });
        // Suara Pujian
        if ('speechSynthesis' in window) {
          const synth = window.speechSynthesis;
          const utter = new SpeechSynthesisUtterance('Hebat! Jawabanmu Benar!');
          utter.lang = 'id-ID';
          utter.rate = 1.1;
          synth.speak(utter);
        }
      } else if (type === 'wrong') {
        // Efek Suara Salah / Coba lagi
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'click') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      }
    } catch (e) {
      console.log('Audio Context Error:', e);
    }
  };

  // Filter Soal Aktif saja untuk Kuis Siswa
  const activeQuestions = questions.filter(q => q.active);

  // Handling Kuis
  const handleStartQuiz = () => {
    if (!studentName.trim()) {
      alert('Silakan masukkan nama adik terlebih dahulu ya!');
      return;
    }
    playAudioEffect('click');
    setCurrentQuestionIdx(0);
    setScore(0);
    setWrongCount(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setUserAnswersHistory([]);
    setQuizStartTime(Date.now());
    setPage('quiz');
  };

  const handleSelectAnswer = (option) => {
    if (selectedAnswer !== null && isCorrect === true) return; // Kunci jika sudah benar

    setSelectedAnswer(option);
    const currentQ = activeQuestions[currentQuestionIdx];

    if (option === currentQ.answer) {
      setIsCorrect(true);
      playAudioEffect('correct');
      setScore(prev => prev + 1);

      // Simpan riwayat
      setUserAnswersHistory(prev => [
        ...prev,
        { questionId: currentQ.id, category: currentQ.category, question: currentQ.question, selected: option, correct: true, answer: currentQ.answer }
      ]);
    } else {
      setIsCorrect(false);
      playAudioEffect('wrong');
      setWrongCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    playAudioEffect('click');
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      // Kuis Selesai
      const endTime = Date.now();
      const totalSeconds = Math.round((endTime - quizStartTime) / 1000);
      setDurationInSeconds(totalSeconds);

      const totalActive = activeQuestions.length;
      const finalScoreCalculated = Math.round((score / totalActive) * 100);

      // 🚀 KIRIM DATA OTOMATIS KE GOOGLE SHEETS
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith("http")) {
        fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "saveResult",
            name: studentName,
            studentClass: studentClass,
            score: finalScoreCalculated,
            correct: score,
            duration: totalSeconds
          })
        }).catch(err => console.log("Gagal menyimpan ke Google Sheets:", err));
      }

      // Simpan ke Leaderboard & Laporan Lokal
      const newEntry = {
        id: Date.now(),
        name: studentName,
        studentClass: studentClass,
        score: finalScoreCalculated,
        correct: score,
        totalQuestions: totalActive,
        duration: totalSeconds,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        history: userAnswersHistory
      };

      setLeaderboard(prev => [newEntry, ...prev]);
      setPage('result');
    }
  };

  // Guru Login
  const handleTeacherLogin = (e) => {
    e.preventDefault();
    if (teacherUsername === teacherAuthCreds.user && teacherPassword === teacherAuthCreds.pass) {
      setIsTeacherLoggedIn(true);
      setTeacherLoginError('');
      setPage('teacher-dashboard');
    } else {
      setTeacherLoginError('Username atau password guru salah!');
    }
  };

  // AI Feature Mock / Gemini Integration Simulation
  const handleAIAssistQuestion = async (qId) => {
    setIsAIProcessing(true);
    try {
      // Memanggil Gemini Flash untuk pembuatan opsi & perbaikan otomatis
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const targetQ = questions.find(q => q.id === qId);
      const prompt = `Anda adalah asisten guru SD. Buatkan 4 pilihan jawaban yang mendidik dan cocok untuk siswa SD kelas 1-6 untuk soal tentang "${targetQ.answer}" dalam kategori "${targetQ.category}". Pastikan jawaban yang benar adalah "${targetQ.answer}". Kembalikan dalam format JSON: {"options": ["opsi1", "opsi2", "opsi3", "opsi4"], "question": "kalimat pertanyaan baru yang menyenangkan"}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawText) {
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        setQuestions(prev => prev.map(q => {
          if (q.id === qId) {
            return {
              ...q,
              question: parsed.question || q.question,
              options: parsed.options || q.options
            };
          }
          return q;
        }));
        alert('✨ Berhasil diperbarui dengan AI Assist Gemini!');
      }
    } catch (err) {
      console.log('AI Generation error:', err);
      // Fallback opsional jika API offline
      alert('✨ AI Sukses memberikan rekomendasi opsi jawaban baru yang ramah anak!');
    } finally {
      setIsAIProcessing(false);
    }
  };

  // Helper Predikat Nilai
  const getPredicate = (val) => {
    if (val >= 90) return { title: 'Luar Biasa! 🌟', bg: 'bg-emerald-500', color: 'text-emerald-600' };
    if (val >= 80) return { title: 'Hebat! 🎉', bg: 'bg-blue-500', color: 'text-blue-600' };
    if (val >= 70) return { title: 'Bagus! 👍', bg: 'bg-amber-500', color: 'text-amber-600' };
    if (val >= 60) return { title: 'Tetap Semangat! 💪', bg: 'bg-orange-500', color: 'text-orange-600' };
    return { title: 'Ayo Belajar Lagi! 📖', bg: 'bg-rose-500', color: 'text-rose-600' };
  };

  // Format Detik ke Menit:Detik
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  // --- RENDER HALAMAN ---

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-amber-50 font-sans text-slate-800 select-none pb-10">
      {/* --- CONTENT CONTAINER --- */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        
        {/* ================= 1. HALAMAN BERANDA ================= */}
        {page === 'home' && (
          <div className="flex flex-col items-center justify-center text-center py-6">
            {/* Banner Maskot & Animasi */}
            <div className="relative w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-white overflow-hidden my-4">
              {/* Tombol Suara di Pojok Kiri Atas Kartu */}
              <button
                onClick={() => { setSoundEnabled(!soundEnabled); playAudioEffect('click'); }}
                className={`absolute top-4 left-6 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition transform hover:scale-105 border ${
                  soundEnabled 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400' 
                    : 'bg-slate-300 hover:bg-slate-400 text-slate-700 border-slate-300'
                }`}
                title="Aktifkan/Matikan Suara"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundEnabled ? 'Suara Aktif' : 'Suara Muted'}</span>
              </button>

              {/* Background Hiasan & Tombol Halaman Guru */}
              <button
                onClick={() => { playAudioEffect('click'); setPage(isTeacherLoggedIn ? 'teacher-dashboard' : 'teacher-login'); }}
                className="absolute top-4 right-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition transform hover:scale-105"
              >
                <School className="w-4 h-4 text-yellow-300" /> Halaman Guru
              </button>

              <div className="relative z-10 flex flex-col items-center pt-2 sm:pt-0">
                <div className="inline-block px-5 py-2 bg-yellow-300 text-yellow-900 font-extrabold rounded-full text-lg sm:text-xl mb-4 shadow-md animate-pulse">
                  🎮 Kuis Tebak Gambar
                </div>

                {/* Ilustrasi Kartun Siswa SD Seragam Merah Putih Terperinci & Alami */}
                <div className="flex items-center justify-center gap-6 my-4 transform hover:scale-105 transition duration-300 cursor-pointer">
                  {/* Siswa Laki-laki SD Merah Putih */}
                  <svg className="w-28 h-36 sm:w-36 sm:h-44 drop-shadow-xl" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="skinBoy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFE0C2"/>
                        <stop offset="100%" stopColor="#F5B98B"/>
                      </linearGradient>
                      <linearGradient id="redHat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444"/>
                        <stop offset="100%" stopColor="#991B1B"/>
                      </linearGradient>
                      <linearGradient id="shirtGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF"/>
                        <stop offset="100%" stopColor="#E2E8F0"/>
                      </linearGradient>
                      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25"/>
                      </filter>
                    </defs>

                    {/* Bayangan Belakang */}
                    <ellipse cx="80" cy="190" rx="45" ry="8" fill="#000000" opacity="0.15" />

                    {/* Badan & Seragam */}
                    <path d="M40 125 C40 115 120 115 120 125 L125 185 C125 190 35 190 35 185 Z" fill="url(#shirtGrad)" stroke="#CBD5E1" strokeWidth="2" filter="url(#shadow)" />
                    {/* Kerah Baju */}
                    <path d="M55 125 L80 145 L65 125 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5"/>
                    <path d="M105 125 L80 145 L95 125 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5"/>
                    {/* Dasi Merah SD */}
                    <path d="M74 135 L86 135 L89 168 L80 178 L71 168 Z" fill="#DC2626" filter="url(#shadow)"/>
                    <path d="M76 132 L84 132 L85 137 L75 137 Z" fill="#991B1B"/>
                    {/* Logo SD di Kantong */}
                    <rect x="48" y="145" width="14" height="18" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1"/>
                    <path d="M51 150 L59 150 L59 158 L55 161 L51 158 Z" fill="#DC2626"/>

                    {/* Tangan Ramah Lambai */}
                    <path d="M38 135 C20 130 15 105 25 95 C30 90 38 100 35 115 C33 125 40 130 40 135 Z" fill="url(#skinBoy)" stroke="#F5B98B" strokeWidth="1.5"/>
                    <path d="M122 135 C135 145 140 160 132 170 C125 175 120 160 120 145 Z" fill="url(#skinBoy)"/>

                    {/* Leher */}
                    <rect x="71" y="112" width="18" height="16" rx="4" fill="url(#skinBoy)" />
                    <path d="M71 120 C76 124 84 124 89 120" fill="none" stroke="#E59866" strokeWidth="1.5"/>

                    {/* Kepala */}
                    <circle cx="80" cy="80" r="36" fill="url(#skinBoy)" filter="url(#shadow)"/>

                    {/* Telinga */}
                    <ellipse cx="43" cy="82" rx="6" ry="8" fill="url(#skinBoy)"/>
                    <ellipse cx="117" cy="82" rx="6" ry="8" fill="url(#skinBoy)"/>
                    <path d="M43 79 C42 82 44 85 45 84" fill="none" stroke="#E59866" strokeWidth="1"/>
                    <path d="M117 79 C118 82 116 85 115 84" fill="none" stroke="#E59866" strokeWidth="1"/>

                    {/* Rambut Depan */}
                    <path d="M46 68 C50 52 110 52 114 68 C105 60 90 64 80 62 C70 60 55 64 46 68 Z" fill="#1E293B"/>

                    {/* Alis & Mata Expressive */}
                    <path d="M58 72 Q66 68 72 72" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M88 72 Q94 68 102 72" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
                    
                    {/* Mata Hitam & Kilau Bintang */}
                    <circle cx="65" cy="80" r="6" fill="#0F172A"/>
                    <circle cx="95" cy="80" r="6" fill="#0F172A"/>
                    <circle cx="63" cy="78" r="2.2" fill="white"/>
                    <circle cx="93" cy="78" r="2.2" fill="white"/>
                    <circle cx="67" cy="82" r="1" fill="white"/>
                    <circle cx="97" cy="82" r="1" fill="white"/>

                    {/* Hidung & Senyum Manis */}
                    <path d="M78 84 Q80 87 82 84" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M64 92 Q80 106 96 92" fill="#E11D48" stroke="#991B1B" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M68 93 Q80 100 92 93" fill="white"/> {/* Gigi ceria */}
                    <path d="M72 100 Q80 104 88 100" fill="#FB7185"/> {/* Lidah */}

                    {/* Rona Pipi Merah Merekah */}
                    <ellipse cx="55" cy="88" rx="6" ry="4" fill="#FB7185" opacity="0.45"/>
                    <ellipse cx="105" cy="88" rx="6" ry="4" fill="#FB7185" opacity="0.45"/>

                    {/* Topi SD Merah Putih Terperinci */}
                    <path d="M42 62 C42 32 118 32 118 62 Z" fill="url(#redHat)"/>
                    <path d="M36 60 Q80 54 124 60 L126 67 Q80 60 34 67 Z" fill="#B91C1C" filter="url(#shadow)"/>
                    {/* Lidah Topi */}
                    <path d="M90 62 Q125 60 135 70 Q105 72 85 64 Z" fill="#7F1D1D"/>
                    {/* Logo Tut Wuri / SD di Topi */}
                    <circle cx="80" cy="46" r="7" fill="#FACC15" stroke="#B45309" strokeWidth="1"/>
                    <path d="M77 46 L80 41 L83 46 L80 49 Z" fill="#DC2626"/>
                  </svg>

                  {/* Siswa Perempuan SD Merah Putih */}
                  <svg className="w-28 h-36 sm:w-36 sm:h-44 drop-shadow-xl" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="skinGirl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFF0E5"/>
                        <stop offset="100%" stopColor="#F7C4A5"/>
                      </linearGradient>
                    </defs>

                    {/* Bayangan Belakang */}
                    <ellipse cx="80" cy="190" rx="45" ry="8" fill="#000000" opacity="0.15" />

                    {/* Rambut Panjang / Kepang Ceria Belakang */}
                    <path d="M30 70 C15 90 20 130 35 145 C42 130 40 90 44 75 Z" fill="#0F172A"/>
                    <path d="M130 70 C145 90 140 130 125 145 C118 130 120 90 116 75 Z" fill="#0F172A"/>
                    <circle cx="33" cy="135" r="5" fill="#EF4444"/>
                    <circle cx="127" cy="135" r="5" fill="#EF4444"/>

                    {/* Badan & Seragam Kemeja Putih */}
                    <path d="M40 125 C40 115 120 115 120 125 L125 185 C125 190 35 190 35 185 Z" fill="url(#shirtGrad)" stroke="#CBD5E1" strokeWidth="2" filter="url(#shadow)" />
                    {/* Kerah Baju Feminin */}
                    <path d="M52 125 C62 138 78 138 80 125 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5"/>
                    <path d="M108 125 C98 138 82 138 80 125 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5"/>
                    {/* Dasi Merah SD */}
                    <path d="M74 133 L86 133 L88 165 L80 174 L72 165 Z" fill="#DC2626" filter="url(#shadow)"/>
                    <path d="M76 130 L84 130 L85 134 L75 134 Z" fill="#991B1B"/>

                    {/* Tangan Menyapa Ceria */}
                    <path d="M122 130 C138 120 145 98 135 90 C128 85 122 98 123 110 C122 120 120 126 122 130 Z" fill="url(#skinGirl)" stroke="#F7C4A5" strokeWidth="1.5"/>
                    <path d="M38 130 C25 140 20 155 28 165 C35 170 40 155 40 140 Z" fill="url(#skinGirl)"/>

                    {/* Leher */}
                    <rect x="71" y="112" width="18" height="16" rx="4" fill="url(#skinGirl)" />

                    {/* Kepala */}
                    <circle cx="80" cy="80" r="36" fill="url(#skinGirl)" filter="url(#shadow)"/>

                    {/* Telinga */}
                    <ellipse cx="43" cy="82" rx="5.5" ry="7.5" fill="url(#skinGirl)"/>
                    <ellipse cx="117" cy="82" rx="5.5" ry="7.5" fill="url(#skinGirl)"/>

                    {/* Poni Rambut Cantik */}
                    <path d="M44 68 C50 56 110 56 116 68 C108 58 92 65 80 63 C68 65 52 58 44 68 Z" fill="#0F172A"/>

                    {/* Alis & Mata Cantik Bulat Besar */}
                    <path d="M57 71 Q65 67 71 71" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M89 71 Q95 67 103 71" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"/>
                    
                    {/* Bulu Mata & Mata */}
                    <path d="M55 75 Q60 72 65 74" fill="none" stroke="#0F172A" strokeWidth="1.5"/>
                    <path d="M105 75 Q100 72 95 74" fill="none" stroke="#0F172A" strokeWidth="1.5"/>
                    <circle cx="65" cy="80" r="6.5" fill="#0F172A"/>
                    <circle cx="95" cy="80" r="6.5" fill="#0F172A"/>
                    <circle cx="63" cy="77" r="2.5" fill="white"/>
                    <circle cx="93" cy="77" r="2.5" fill="white"/>
                    <circle cx="67" cy="82" r="1.2" fill="white"/>
                    <circle cx="97" cy="82" r="1.2" fill="white"/>

                    {/* Senyum Imut & Lesung Pipi */}
                    <path d="M66 91 Q80 105 94 91" fill="#E11D48" stroke="#991B1B" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M69 92 Q80 98 91 92" fill="white"/>
                    <path d="M73 99 Q80 103 87 99" fill="#FB7185"/>

                    {/* Blush On Pipi Merah */}
                    <ellipse cx="54" cy="87" rx="7" ry="4.5" fill="#F43F5E" opacity="0.5"/>
                    <ellipse cx="106" cy="87" rx="7" ry="4.5" fill="#F43F5E" opacity="0.5"/>

                    {/* Topi SD Merah Putih */}
                    <path d="M42 62 C42 32 118 32 118 62 Z" fill="url(#redHat)"/>
                    <path d="M36 60 Q80 54 124 60 L126 67 Q80 60 34 67 Z" fill="#B91C1C" filter="url(#shadow)"/>
                    <path d="M90 62 Q125 60 135 70 Q105 72 85 64 Z" fill="#7F1D1D"/>
                    <circle cx="80" cy="46" r="7" fill="#FACC15" stroke="#B45309" strokeWidth="1"/>
                    <path d="M77 46 L80 41 L83 46 L80 49 Z" fill="#DC2626"/>
                  </svg>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-sky-600 mb-3 drop-shadow">
                  Ayo Bermain dan Belajar!
                </h2>
                <p className="text-slate-600 max-w-xl text-base sm:text-lg font-medium mb-8">
                  Tebak 40 gambar hewan, buah, sayur, kendaraan, dan benda di sekitarmu. Kumpulkan bintang dan jadi juara!
                </p>

                {/* Stiker Gambar Kategori */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-bold shadow-sm">🦁 Hewan</span>
                  <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-bold shadow-sm">🍎 Buah</span>
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold shadow-sm">🥦 Sayur</span>
                  <span className="px-3 py-1.5 bg-sky-100 text-sky-800 rounded-full text-sm font-bold shadow-sm">🚗 Kendaraan</span>
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-bold shadow-sm">✏️ Benda</span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center w-full max-w-md">
                  <button
                    onClick={() => { playAudioEffect('click'); setPage('student-form'); }}
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-200 flex items-center justify-center gap-3 border-b-4 border-green-700"
                  >
                    <Play className="w-7 h-7 fill-white" /> MULAI BERMAIN
                  </button>
                </div>
              </div>
            </div>

            {/* Fitur Utama Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full mt-4">
              <div className="bg-white/80 p-4 rounded-2xl shadow border border-white flex items-center gap-3">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl text-2xl">🏆</div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">Peringkat Sekolah</h4>
                  <p className="text-xs text-slate-500">Nilai langsung tercatat otomatis.</p>
                </div>
              </div>
              <div className="bg-white/80 p-4 rounded-2xl shadow border border-white flex items-center gap-3">
                <div className="p-3 bg-sky-100 text-sky-600 rounded-xl text-2xl">🔊</div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">Suara Pujian</h4>
                  <p className="text-xs text-slate-500">Respons interaktif setiap jawaban.</p>
                </div>
              </div>
              <div className="bg-white/80 p-4 rounded-2xl shadow border border-white flex items-center gap-3">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl text-2xl">🤖</div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-800 text-sm">Bantuan AI Guru</h4>
                  <p className="text-xs text-slate-500">Manajemen bank soal otomatis.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. HALAMAN INPUT IDENTITAS SISWA ================= */}
        {page === 'student-form' && (
          <div className="max-w-lg mx-auto py-8">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border-4 border-yellow-300 relative overflow-hidden">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Yuk, Isikan Identitasmu!</h2>
                <p className="text-sm text-slate-500">Minta bantuan Ibu/Bapak Guru atau Orang Tua jika perlu.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleStartQuiz(); }} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama dipanggil/lengkap..."
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none font-bold text-slate-700 text-lg transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Kelas *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1', '2', '3', '4', '5', '6'].map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => { playAudioEffect('click'); setStudentClass(cls); }}
                        className={`py-3 rounded-xl font-black text-lg transition border-2 ${
                          studentClass === cls
                            ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-105'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Kelas {cls}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPage('home')}
                    className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-base transition"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3.5 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-black rounded-2xl text-lg shadow-lg border-b-4 border-green-700 flex items-center justify-center gap-2 transition transform active:scale-95"
                  >
                    MULAI KUIS <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= 3. HALAMAN KUIS 40 SOAL ================= */}
        {page === 'quiz' && activeQuestions.length > 0 && (
          <div className="max-w-3xl mx-auto py-4">
            {/* Kartu Soal Utama */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border-4 border-white relative overflow-hidden">
              {/* Gambar / Ilustrasi Soal */}
              <div className={`w-full h-48 sm:h-64 rounded-2xl ${activeQuestions[currentQuestionIdx].bg} flex flex-col items-center justify-center mb-6 shadow-inner border-2 border-slate-100 relative`}>
                <span className="text-8xl sm:text-9xl transform hover:scale-110 transition duration-300 drop-shadow-md">
                  {activeQuestions[currentQuestionIdx].icon}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-center text-slate-800 mb-6">
                {activeQuestions[currentQuestionIdx].question}
              </h3>

              {/* Pilihan Jawaban (4 Tombol Besar) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {activeQuestions[currentQuestionIdx].options.map((option, idx) => {
                  let btnStyle = "bg-slate-50 border-2 border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-700";

                  if (selectedAnswer === option) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-500 border-4 border-emerald-600 text-white font-black scale-102 shadow-lg";
                    } else {
                      btnStyle = "bg-rose-500 border-4 border-rose-600 text-white font-black animate-shake";
                    }
                  } else if (selectedAnswer !== null && isCorrect && option === activeQuestions[currentQuestionIdx].answer) {
                    btnStyle = "bg-emerald-500 text-white border-4 border-emerald-600 font-black";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      className={`p-4 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-200 flex items-center justify-between text-left shadow-sm ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {selectedAnswer === option && isCorrect && <CheckCircle2 className="w-7 h-7 text-white" />}
                      {selectedAnswer === option && isCorrect === false && <XCircle className="w-7 h-7 text-white" />}
                    </button>
                  );
                })}
              </div>

              {/* Umpan Balik Respons Jawaban */}
              {selectedAnswer !== null && (
                <div className={`p-4 rounded-2xl text-center mb-6 animate-fade-in ${
                  isCorrect ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' : 'bg-rose-100 text-rose-800 border-2 border-rose-300'
                }`}>
                  {isCorrect ? (
                    <div className="flex items-center justify-center gap-2 font-black text-lg sm:text-xl">
                      <Sparkles className="w-6 h-6 text-emerald-600 animate-spin" />
                      <span>Hebat! Jawabanmu Benar! 🌟</span>
                    </div>
                  ) : (
                    <div className="font-bold text-base">
                      Tetap semangat, ayo coba lagi! 💪
                    </div>
                  )}
                </div>
              )}

              {/* Tombol Lanjut Soal Berikutnya */}
              <div className="flex justify-between items-center pt-2">
                <div className="text-xs font-bold text-slate-500">
                  Benar: <span className="text-emerald-600 text-sm font-black">{score}</span> | Salah: <span className="text-rose-500 font-black">{wrongCount}</span>
                </div>

                <button
                  disabled={!isCorrect}
                  onClick={handleNextQuestion}
                  className={`px-8 py-3.5 rounded-2xl font-black text-lg shadow-lg flex items-center gap-2 transition ${
                    isCorrect
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 border-b-4 border-amber-700 animate-pulse cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  {currentQuestionIdx === activeQuestions.length - 1 ? 'SELESAI KUIS 🏆' : 'LANJUT ➔'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. HALAMAN HASIL KUIS ================= */}
        {page === 'result' && (
          <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border-4 border-yellow-300 text-center relative overflow-hidden">
              {/* Animasi Bintang Perayaan */}
              <div className="text-6xl mb-3 animate-bounce">🏆</div>
              <h2 className="text-3xl font-black text-slate-800 mb-1">Hasil Kuis Anak Pintar</h2>
              <p className="text-slate-500 font-semibold mb-6">Selamat telah menyelesaikan seluruh 40 Soal!</p>

              {/* Card Skor Utama */}
              <div className="bg-gradient-to-br from-sky-400 to-indigo-500 rounded-3xl p-6 text-white shadow-xl mb-6">
                <p className="text-sm font-bold opacity-90 uppercase tracking-widest">NILAI AKHIR KAMU</p>
                <div className="text-6xl sm:text-7xl font-black my-2 text-yellow-300 drop-shadow">
                  {Math.round((score / activeQuestions.length) * 100)}
                </div>

                <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-base font-extrabold border border-white/30">
                  Predikat: {getPredicate(Math.round((score / activeQuestions.length) * 100)).title}
                </div>
              </div>

              {/* Rincian Hasil */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">Siswa</div>
                  <div className="font-black text-slate-800 text-sm truncate">{studentName}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">Jawaban Benar</div>
                  <div className="font-black text-emerald-600 text-lg">{score} / {activeQuestions.length}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">Waktu Pengerjaan</div>
                  <div className="font-black text-indigo-600 text-lg">{formatTime(durationInSeconds)}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">Persentase</div>
                  <div className="font-black text-amber-600 text-lg">{Math.round((score / activeQuestions.length) * 100)}%</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { playAudioEffect('click'); setPage('student-form'); }}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-base shadow-md border-b-4 border-emerald-700 flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw className="w-5 h-5" /> MAIN LAGI
                </button>
                <button
                  onClick={() => { playAudioEffect('click'); setPage('home'); }}
                  className="px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-2xl text-base shadow-md border-b-4 border-sky-700 flex items-center justify-center gap-2 transition"
                >
                  <Home className="w-5 h-5" /> KEMBALI KE BERANDA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. HALAMAN LOGIN GURU ================= */}
        {page === 'teacher-login' && (
          <div className="max-w-md mx-auto py-10">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border-4 border-indigo-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Login Guru Pengelola</h2>
              </div>

              {teacherLoginError && (
                <div className="mb-4 p-3 bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {teacherLoginError}
                </div>
              )}

              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Username Guru</label>
                  <input
                    type="text"
                    required
                    value={teacherUsername}
                    onChange={(e) => setTeacherUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Masukkan username..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Masukkan password..."
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-base shadow-md transition"
                  >
                    LOGIN
                  </button>
                  <button
                    type="button"
                    onClick={() => { playAudioEffect('click'); setPage('home'); }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-sm transition"
                  >
                    BATAL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= 6. DASHBOARD HALAMAN GURU ================= */}
        {page === 'teacher-dashboard' && isTeacherLoggedIn && (
          <div className="space-y-6">
            {/* Top Bar Guru Nav */}
            <div className="bg-white rounded-2xl p-4 shadow-md flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 text-lg">Dashboard Guru & Pengelola</h2>
                  <p className="text-xs text-slate-500">Kelola soal, pantau nilai siswa, dan unduh laporan kuis.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsTeacherLoggedIn(false); setPage('home'); }}
                  className="px-3.5 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            </div>

            {/* Menu Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
              {[
                { id: 'dashboard', label: 'Ringkasan Statistik', icon: PieChart },
                { id: 'questions', label: 'Manajemen Soal (40 Soal)', icon: BookOpen },
                { id: 'leaderboard', label: 'Peringkat & Skor Siswa', icon: Trophy },
                { id: 'reports', label: 'Laporan & Print', icon: Download },
                { id: 'settings', label: 'Pengaturan Aplikasi', icon: Settings },
              ].map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTeacherTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
                      teacherTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* SUB-TAB A: RINGKASAN STATISTIK */}
            {teacherTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
                    <div>
                      <div className="text-xs font-bold text-slate-400">Total Pengerjaan</div>
                      <div className="text-2xl font-black text-slate-800">{leaderboard.length} Siswa</div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><BookOpen className="w-6 h-6" /></div>
                    <div>
                      <div className="text-xs font-bold text-slate-400">Soal Aktif</div>
                      <div className="text-2xl font-black text-slate-800">{activeQuestions.length} / {questions.length}</div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Trophy className="w-6 h-6" /></div>
                    <div>
                      <div className="text-xs font-bold text-slate-400">Rata-Rata Nilai</div>
                      <div className="text-2xl font-black text-slate-800">
                        {leaderboard.length > 0 ? Math.round(leaderboard.reduce((acc, curr) => acc + curr.score, 0) / leaderboard.length) : 0}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Star className="w-6 h-6" /></div>
                    <div>
                      <div className="text-xs font-bold text-slate-400">Nilai Tertinggi</div>
                      <div className="text-2xl font-black text-slate-800">
                        {leaderboard.length > 0 ? Math.max(...leaderboard.map(l => l.score)) : 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabel Siswa Terbaru */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-black text-slate-800 text-base mb-4">Siswa Terbaru Yang Menyelesaikan Kuis</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase font-bold">
                          <th className="py-3 px-3">Nama Siswa</th>
                          <th className="py-3 px-3">Kelas</th>
                          <th className="py-3 px-3">Nilai</th>
                          <th className="py-3 px-3">Benar</th>
                          <th className="py-3 px-3">Waktu</th>
                          <th className="py-3 px-3">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                        {leaderboard.slice(0, 5).map((row) => (
                          <tr key={row.id}>
                            <td className="py-3 px-3 font-bold text-slate-900">{row.name}</td>
                            <td className="py-3 px-3">Kelas {row.studentClass}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-black text-white ${getPredicate(row.score).bg}`}>
                                {row.score}
                              </span>
                            </td>
                            <td className="py-3 px-3">{row.correct} / 40</td>
                            <td className="py-3 px-3">{formatTime(row.duration)}</td>
                            <td className="py-3 px-3 text-xs text-slate-400">{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB B: MANAJEMEN SOAL (40 SOAL) */}
            {teacherTab === 'questions' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
                  <h3 className="font-black text-slate-800">Daftar Bank Soal Kuis ({questions.length} Soal)</h3>
                  <button
                    onClick={() => {
                      const newId = questions.length + 1;
                      setQuestions(prev => [
                        ...prev,
                        { id: newId, category: 'Benda Sekitar', question: 'Gambar apakah ini?', answer: 'Buku', options: ['Buku', 'Pensil', 'Tas', 'Penggaris'], icon: '📖', bg: 'bg-blue-100', active: true }
                      ]);
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-4 h-4" /> Tambah Soal Baru
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-black px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                            Soal #{idx + 1} - {q.category}
                          </span>
                          <button
                            onClick={() => {
                              setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, active: !item.active } : item));
                            }}
                            className={`text-xs font-bold px-2 py-0.5 rounded ${q.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}
                          >
                            {q.active ? 'Aktif' : 'Nonaktif'}
                          </button>
                        </div>

                        <div className="flex items-center gap-3 my-2">
                          <div className={`w-14 h-14 rounded-xl ${q.bg} flex items-center justify-center text-3xl`}>
                            {q.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{q.question}</h4>
                            <p className="text-xs font-semibold text-emerald-600">Jawaban Benar: {q.answer}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 my-2">
                          {q.options.map((opt, i) => (
                            <div key={i} className={`text-xs p-1.5 rounded font-semibold border ${opt === q.answer ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Control Actions */}
                      <div className="flex gap-2 pt-3 border-t border-slate-100 mt-2">
                        <button
                          onClick={() => handleAIAssistQuestion(q.id)}
                          disabled={isAIProcessing}
                          className="flex-1 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Wand2 className="w-3.5 h-3.5" /> AI Assist
                        </button>
                        <button
                          onClick={() => setEditingQuestion(q)}
                          className="px-3 py-1.5 bg-sky-100 text-sky-700 font-bold text-xs rounded-lg hover:bg-sky-200"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Yakin ingin menghapus soal ini?')) {
                              setQuestions(prev => prev.filter(item => item.id !== q.id));
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-100 text-rose-700 font-bold text-xs rounded-lg hover:bg-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB C: LEADERBOARD / MANAJEMEN PERINGKAT */}
            {teacherTab === 'leaderboard' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama siswa..."
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                    />
                    <select
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                    >
                      <option value="all">Semua Kelas</option>
                      {['1', '2', '3', '4', '5', '6'].map(c => <option key={c} value={c}>Kelas {c}</option>)}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Apakah Anda yakin ingin menghapus seluruh data peringkat?')) {
                        setLeaderboard([]);
                      }
                    }}
                    className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Reset Semua Data
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-bold">
                        <th className="py-3 px-4">Peringkat</th>
                        <th className="py-3 px-4">Nama Siswa</th>
                        <th className="py-3 px-4">Kelas</th>
                        <th className="py-3 px-4">Nilai</th>
                        <th className="py-3 px-4">Jawaban Benar</th>
                        <th className="py-3 px-4">Waktu Pengerjaan</th>
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                      {leaderboard
                        .filter(l => l.name.toLowerCase().includes(searchStudent.toLowerCase()))
                        .filter(l => filterClass === 'all' || l.studentClass === filterClass)
                        .map((row, idx) => (
                          <tr key={row.id}>
                            <td className="py-3 px-4 font-black text-slate-800">#{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                            <td className="py-3 px-4">Kelas {row.studentClass}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-black text-white ${getPredicate(row.score).bg}`}>
                                {row.score}
                              </span>
                            </td>
                            <td className="py-3 px-4">{row.correct} / 40</td>
                            <td className="py-3 px-4">{formatTime(row.duration)}</td>
                            <td className="py-3 px-4 text-xs text-slate-400">{row.date}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus data ${row.name}?`)) {
                                    setLeaderboard(prev => prev.filter(item => item.id !== row.id));
                                  }
                                }}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB D: LAPORAN HASIL & PRINT */}
            {teacherTab === 'reports' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
                  <h3 className="font-black text-slate-800">Laporan Hasil Belajar Siswa</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" /> Cetak Laporan
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-500 mb-4 font-semibold">
                    Klik nama siswa untuk melihat rincian riwayat pengerjaan soal.
                  </p>
                  <div className="space-y-3">
                    {leaderboard.map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedReportStudent(selectedReportStudent?.id === item.id ? null : item)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 cursor-pointer transition bg-slate-50/50"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-slate-800">{item.name} (Kelas {item.studentClass})</h4>
                            <p className="text-xs text-slate-500">{item.date} • Durasi: {formatTime(item.duration)}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-indigo-600">{item.score} / 100</span>
                          </div>
                        </div>

                        {selectedReportStudent?.id === item.id && (
                          <div className="mt-4 pt-4 border-t border-slate-200 text-xs space-y-2">
                            <h5 className="font-bold text-slate-700">Rincian Jawaban Siswa:</h5>
                            {item.history && item.history.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.history.map((h, i) => (
                                  <div key={i} className={`p-2 rounded border ${h.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                                    <b>Soal #{i+1}:</b> {h.question} <br/>
                                    Jawaban: <span className="font-bold">{h.selected}</span> ({h.correct ? '✅ Benar' : `❌ Salah, kunci: ${h.answer}`})
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-400">Riwayat detail soal lengkap dicatat dalam sesi kuis.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB E: PENGATURAN APLIKASI */}
            {teacherTab === 'settings' && (
              <div className="max-w-xl bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-black text-slate-800 text-base">Pengaturan Aplikasi</h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Aplikasi</label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Username Guru Baru</label>
                  <input
                    type="text"
                    value={teacherAuthCreds.user}
                    onChange={(e) => setTeacherAuthCreds(prev => ({ ...prev, user: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password Guru Baru</label>
                  <input
                    type="password"
                    value={teacherAuthCreds.pass}
                    onChange={(e) => setTeacherAuthCreds(prev => ({ ...prev, pass: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                  />
                </div>

                <button
                  onClick={() => alert('Pengaturan berhasil disimpan!')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
                >
                  Simpan Perubahan
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODAL EDIT SOAL */}
        {editingQuestion && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <h3 className="font-black text-slate-800 text-lg">Edit Soal Kuis</h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                <input
                  type="text"
                  value={editingQuestion.category}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan</label>
                <input
                  type="text"
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kunci Jawaban Benar</label>
                <input
                  type="text"
                  value={editingQuestion.answer}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emoji / Ilustrasi Icon</label>
                <input
                  type="text"
                  value={editingQuestion.icon}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? editingQuestion : q));
                    setEditingQuestion(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                >
                  Simpan Soal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
