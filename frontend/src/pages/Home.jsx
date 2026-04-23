import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
  // State Management
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  
  // State Filter
  const [filters, setFilters] = useState({ category: '', difficulty: '' });
  
  // State Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- BAGIAN YANG DIUBAH 1: Tambah state untuk Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- BAGIAN YANG DIUBAH 2: Pisahkan fungsi fetchRecipes agar bisa dipanggil ulang ---
  const fetchRecipes = async () => {
    try {
      const response = await api.get('/resepUMKM');
      if (response.data.success) {
        setRecipes(response.data.data);
        setFilteredRecipes(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // Panggil fetchRecipes saat komponen pertama kali dimuat
  useEffect(() => {
    fetchRecipes();
  }, []);

  // 2. Efek Reaktif untuk Filter (Poin 4 & 8)
  useEffect(() => {
    let result = recipes;

    if (filters.category) {
      result = result.filter(recipe => recipe.category === filters.category);
    }
    if (filters.difficulty) {
      result = result.filter(recipe => recipe.difficulty === filters.difficulty);
    }

    setFilteredRecipes(result);
    setCurrentPage(1); // Reset ke halaman 1 tiap kali filter berubah
  }, [filters, recipes]);

  // 3. Logika Paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--emerald-pine)' }}>Resep Nusantara UMKM</h1>
        {/* --- BAGIAN YANG DIUBAH 3: Tambahkan onClick untuk membuka Modal --- */}
        <button className="btn" onClick={() => setIsModalOpen(true)}>+ Tambah Resep</button>
      </div>

      {/* Filter Section */}
      <div style={{ margin: '20px 0', display: 'flex', gap: '15px' }}>
        <select name="category" onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px' }}>
          <option value="">Semua Kategori</option>
          <option value="Makanan Utama">Makanan Utama</option>
          <option value="Camilan">Camilan</option>
          <option value="Minuman">Minuman</option>
        </select>

        <select name="difficulty" onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px' }}>
          <option value="">Semua Tingkat Kesulitan</option>
          <option value="Mudah">Mudah</option>
          <option value="Sedang">Sedang</option>
          <option value="Sulit">Sulit</option>
        </select>
      </div>

      {/* Grid Resep (Poin 14) */}
      <div className="recipe-grid">
        {currentRecipes.length > 0 ? (
          currentRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <p>Tidak ada resep yang ditemukan.</p>
        )}
      </div>

      {/* Paginasi Controls */}
      {totalPages > 1 && (
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ padding: '8px 16px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Sebelumnya
          </button>
          <span style={{ padding: '8px' }}>Halaman {currentPage} dari {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ padding: '8px 16px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Selanjutnya
          </button>
        </div>
      )}

      {/* --- BAGIAN YANG DIUBAH 4: Panggil komponen Modal di sini --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refreshData={fetchRecipes} 
      />
    </div>
  );
};

export default Home;