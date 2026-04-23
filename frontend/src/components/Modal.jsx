import { useState } from 'react';
import api from '../services/api';

const Modal = ({ isOpen, onClose, refreshData }) => {
  // State Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Makanan Utama');
  const [difficulty, setDifficulty] = useState('Mudah');
  
  // Poin 6: Dynamic form field (State berupa array)
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  if (!isOpen) return null; // Jika state isOpen false, jangan render modal

  // --- LOGIKA DYNAMIC FIELDS ---
  const handleDynamicChange = (index, value, type) => {
    if (type === 'ingredient') {
      const newArr = [...ingredients];
      newArr[index] = value;
      setIngredients(newArr);
    } else {
      const newArr = [...steps];
      newArr[index] = value;
      setSteps(newArr);
    }
  };

  const addField = (type) => {
    if (type === 'ingredient') setIngredients([...ingredients, '']);
    else setSteps([...steps, '']);
  };

  const removeField = (index, type) => {
    if (type === 'ingredient') {
      setIngredients(ingredients.filter((_, i) => i !== index));
    } else {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  // --- LOGIKA SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Poin 7: Validasi minimal 1 bahan dan 1 langkah
    const validIngredients = ingredients.filter(i => i.trim() !== '');
    const validSteps = steps.filter(s => s.trim() !== '');

    if (validIngredients.length === 0 || validSteps.length === 0) {
      alert("Peringatan: Minimal harus ada 1 bahan dan 1 langkah yang terisi!");
      return;
    }

    // Poin 9: Konfirmasi sebelum submit
    if (window.confirm("Apakah kamu yakin data resep sudah benar dan ingin menyimpannya?")) {
      try {
        const payload = { title, category, difficulty, ingredients: validIngredients, steps: validSteps };
        
        // Kirim ke Backend
        const response = await api.post('/resepUMKM', payload);
        
        if (response.data.success) {
          alert("Yeay! Resep berhasil ditambahkan."); // Feedback sukses
          
          // Reset form
          setTitle(''); setCategory('Makanan Utama'); setDifficulty('Mudah');
          setIngredients(['']); setSteps(['']);
          
          refreshData(); // Perbarui data di Home
          onClose(); // Tutup modal
        }
      } catch (error) {
        // Feedback gagal
        alert("Gagal menambahkan resep: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ color: 'var(--emerald-pine)', marginTop: 0 }}>Tambah Resep Baru</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Data Utama */}
          <div className="form-group">
            <label>Judul Resep</label>
            <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          
          <div className="form-group" style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>Kategori</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Makanan Utama">Makanan Utama</option>
                <option value="Camilan">Camilan</option>
                <option value="Minuman">Minuman</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Tingkat Kesulitan</label>
              <select className="form-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sulit">Sulit</option>
              </select>
            </div>
          </div>

          {/* Bahan-bahan (Dynamic) */}
          <div className="form-group">
            <label>Bahan-bahan</label>
            {ingredients.map((item, index) => (
              <div key={index} className="dynamic-row">
                <input type="text" className="form-input" placeholder={`Bahan ${index + 1}`} value={item} onChange={(e) => handleDynamicChange(index, e.target.value, 'ingredient')} required />
                {ingredients.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => removeField(index, 'ingredient')}>X</button>
                )}
              </div>
            ))}
            <button type="button" className="btn-add" onClick={() => addField('ingredient')}>+ Tambah Bahan</button>
          </div>

          {/* Langkah-langkah (Dynamic) */}
          <div className="form-group">
            <label>Langkah-langkah</label>
            {steps.map((item, index) => (
              <div key={index} className="dynamic-row">
                <input type="text" className="form-input" placeholder={`Langkah ${index + 1}`} value={item} onChange={(e) => handleDynamicChange(index, e.target.value, 'step')} required />
                {steps.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => removeField(index, 'step')}>X</button>
                )}
              </div>
            ))}
            <button type="button" className="btn-add" onClick={() => addField('step')}>+ Tambah Langkah</button>
          </div>

          {/* Aksi */}
          <div className="modal-actions">
            <button type="button" className="btn" style={{ backgroundColor: '#95a5a6' }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn">Simpan Resep</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;