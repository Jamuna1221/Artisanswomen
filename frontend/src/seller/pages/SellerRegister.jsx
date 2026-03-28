import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';
import { useAuth } from '../context/AuthContext';
import './seller.css';

const CRAFT_TYPES = [
  'Pottery', 'Weaving', 'Embroidery', 'Jewelry',
  'Painting', 'Woodwork', 'Textile', 'Knitting',
  'Crochet', 'Block Printing', 'Leather Work', 'Terracotta',
];

const ID_PROOF_TYPES = [
  'Aadhaar Card', 'PAN Card', 'Passport',
  'Driving Licence', 'Bank Passbook', 'Voter ID',
];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const InputField = ({ label, icon, required, full, ...props }) => (
  <div className={`seller-field ${full ? 'full' : ''}`}>
    <label className="seller-label">
      {label} {required && <span className="req">*</span>}
    </label>
    <div className="seller-input-wrap">
      {icon && <span className="seller-input-icon">{icon}</span>}
      <input
        required={required}
        className={`seller-input ${icon ? 'has-icon' : ''}`}
        {...props}
      />
    </div>
  </div>
);

export default function SellerRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otherCraft, setOtherCraft] = useState('');

  const [form, setForm] = useState({
    name: localStorage.getItem('pendingName') || '',
    email: localStorage.getItem('pendingEmail') || '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    aadhaarNumber: '',
    phone: '',
    craftType: [],
    experience: '',
    bio: '',
    city: '',
    district: '',
    state: '',
    whatsapp: '',
    instagram: '',
    hasPehchanCard: '',
    idProofType: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [artisanCardFile, setArtisanCardFile] = useState(null);
  const [idProofFile, setIdProofFile] = useState(null);
  const [businessProofFile, setBusinessProofFile] = useState(null);
  const [addressProofFile, setAddressProofFile] = useState(null);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('tempToken')) navigate('/seller/signup');
  }, [navigate]);

  const toggleCraft = (craft) => {
    setForm((prev) => ({
      ...prev,
      craftType: prev.craftType.includes(craft)
        ? prev.craftType.filter((c) => c !== craft)
        : [...prev.craftType, craft],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.craftType.length === 0) return setError('Please select at least one craft type');
    if (!idProofFile) return setError('Please upload an ID proof document');

    setLoading(true);
    const tempToken = localStorage.getItem('tempToken');

    try {
      const data = new FormData();
      const allCrafts = [...form.craftType];
      if (otherCraft.trim()) allCrafts.push(`Other: ${otherCraft.trim()}`);

      Object.entries(form).forEach(([key, val]) => {
        if (key !== 'craftType' && key !== 'confirmPassword') data.append(key, val);
      });
      data.append('craftType', JSON.stringify(allCrafts));

      if (profileImage) data.append('profileImage', profileImage);
      if (artisanCardFile && form.hasPehchanCard === 'yes') data.append('artisanCardFile', artisanCardFile);
      if (idProofFile) data.append('idProofFile', idProofFile);
      if (businessProofFile) data.append('businessProofFile', businessProofFile);
      if (addressProofFile) data.append('addressProofFile', addressProofFile);
      if (productImages && productImages.length > 0) {
        productImages.forEach(file => data.append('productImages', file));
      }

      const res = await api.post('/auth/register', data, {
        headers: { Authorization: `Bearer ${tempToken}` },
      });

      login(res.data.authToken, {
        name: res.data.name,
        email: res.data.email,
        verificationStatus: res.data.verificationStatus,
      });

      localStorage.removeItem('tempToken');
      localStorage.removeItem('pendingName');
      localStorage.removeItem('pendingEmail');

      navigate('/seller/pending');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const FileUploadBox = ({ label, accept, file, onChange, required, isMultiple }) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label className="seller-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
        {label} {required && <span className="req">*</span>}
      </label>
      <label className="seller-file-label">
        <input
          type="file"
          accept={accept}
          multiple={isMultiple}
          onChange={(e) => isMultiple ? onChange(Array.from(e.target.files)) : onChange(e.target.files[0])}
        />
        {isMultiple && file && file.length > 0 ? (
          <>
            <div className="seller-file-icon" style={{ color: '#1a5c38' }}>✓</div>
            <div className="seller-file-hint success">{file.length} files selected</div>
            <div className="seller-file-name" style={{ marginTop: '0.2rem' }}>Click to change</div>
          </>
        ) : (!isMultiple && file) ? (
          <>
            <div className="seller-file-icon" style={{ color: 'var(--teal)' }}>✓</div>
            <div className="seller-file-hint success">{file.name}</div>
            <div className="seller-file-name" style={{ marginTop: '0.2rem' }}>Click to change</div>
          </>
        ) : (
          <>
            <div className="seller-file-icon">📁</div>
            <div className="seller-file-hint">Click or drag to upload</div>
            <div className="seller-file-name">JPEG, PNG, PDF — max 5 MB</div>
          </>
        )}
      </label>
    </div>
  );

  return (
    <div className="seller-page-scroll">
      <div className="seller-form-wrap">

        {/* ── Header banner ── */}
        <div className="seller-form-header">
          <div className="seller-form-header-bg">🧵</div>
          <div className="seller-form-header-pill">✦ Artisan Registration</div>
          <h1 className="seller-form-header-title">Complete Your Profile</h1>
          <p className="seller-form-header-sub">
            Fill in your details to start selling on Handora. Your application will be reviewed by our team.
          </p>
        </div>

        {error && <div className="seller-alert error" style={{ marginBottom: '1rem' }}>⚠ {error}</div>}

        <form onSubmit={handleSubmit}>

          {/* 1 · Personal Information */}
          <div className="seller-section-card">
            <h2 className="seller-section-title">
              <span className="seller-section-num">1</span> Personal Information
            </h2>
            <div className="seller-grid seller-grid-2">
              <InputField
                label="Full Name" icon="👤" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <InputField
                label="Email Address" icon="✉" required readOnly
                value={form.email}
              />
              <InputField
                label="Age" icon="#" type="number" min="18" required
                value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
              <div className="seller-field">
                <label className="seller-label">Gender <span className="req">*</span></label>
                <select
                  required className="seller-select"
                  value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Select gender</option>
                  <option value="Women">Women</option>
                  <option value="Transwomen">Transwomen</option>
                </select>
              </div>
              <InputField
                label="Aadhaar Number" icon="🆔" required maxLength={12}
                value={form.aadhaarNumber}
                onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
              />
              <InputField
                label="Phone Number" icon="📞" required type="tel"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          {/* 2 · Set Password */}
          <div className="seller-section-card">
            <h2 className="seller-section-title">
              <span className="seller-section-num">2</span> Set Password
            </h2>
            <div className="seller-grid seller-grid-2">
              <InputField
                label="Password" icon="🔒" type="password" required
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
              />
              <InputField
                label="Confirm Password" icon="🔒" type="password" required
                value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* 3 · Craft & Profile */}
          <div className="seller-section-card">
            <h2 className="seller-section-title">
              <span className="seller-section-num">3</span> Craft & Profile
            </h2>
            <div className="seller-field" style={{ marginBottom: '1.25rem' }}>
              <label className="seller-label">
                Craft Type <span className="req">*</span>
                <span style={{ fontWeight: 400, color: 'var(--smoke)', textTransform: 'none', letterSpacing: 0 }}> — select all that apply</span>
              </label>
              <div className="craft-grid">
                {CRAFT_TYPES.map(craft => (
                  <label key={craft} className="craft-checkbox-label">
                    <input type="checkbox" checked={form.craftType.includes(craft)} onChange={() => toggleCraft(craft)} />
                    {craft}
                  </label>
                ))}
                <label className="craft-checkbox-label">
                  <input
                    type="checkbox"
                    checked={otherCraft !== ''}
                    onChange={(e) => { !e.target.checked ? setOtherCraft('') : setOtherCraft(' '); }}
                  />
                  Other
                </label>
              </div>
              {otherCraft !== '' && (
                <input
                  type="text" className="seller-input" style={{ marginTop: '0.75rem' }}
                  value={otherCraft} onChange={(e) => setOtherCraft(e.target.value)}
                  placeholder="Specify craft (e.g. Macramé)"
                />
              )}
            </div>

            <div className="seller-grid seller-grid-2">
              <InputField
                label="Years of Experience" icon="⏱" required
                value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}
                placeholder="e.g. 5 years"
              />
              <div className="seller-field full">
                <label className="seller-label">Bio / About You <span className="req">*</span></label>
                <textarea
                  required className="seller-textarea"
                  value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell buyers about yourself, your craft, and your story…"
                />
              </div>
            </div>
          </div>

          {/* 4 · Location */}
          <div className="seller-section-card">
            <h2 className="seller-section-title">
              <span className="seller-section-num">4</span> Location
            </h2>
            <div className="seller-grid seller-grid-3">
              <InputField
                label="City" icon="📍" required
                value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <InputField
                label="District" icon="🗺" required
                value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
              <div className="seller-field">
                <label className="seller-label">State <span className="req">*</span></label>
                <select
                  required className="seller-select"
                  value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                >
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 5 · Social Links */}
          <div className="seller-section-card">
            <h2 className="seller-section-title">
              <span className="seller-section-num">5</span> Social Links
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 400, fontSize: '0.8rem', color: 'var(--smoke)' }}>Optional</span>
            </h2>
            <div className="seller-grid seller-grid-2">
              <InputField
                label="WhatsApp Number" icon="📱"
                value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
              <InputField
                label="Instagram Handle" icon="@"
                value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              />
            </div>
          </div>

          {/* 6 · Documents */}
          <div className="seller-section-card">
            <h2 className="seller-section-title">
              <span className="seller-section-num">6</span> Documents & Verification
            </h2>

            <FileUploadBox
              label="Profile Photo" accept="image/*"
              file={profileImage} onChange={setProfileImage}
            />

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="seller-label" style={{ display: 'block', marginBottom: '0.6rem' }}>
                Do you have a Pehchan Card? <span className="req">*</span>
              </label>
              <div className="seller-toggle-row">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, hasPehchanCard: 'yes' })}
                  className={`seller-toggle-btn ${form.hasPehchanCard === 'yes' ? 'selected' : ''}`}
                >
                  ✓ Yes, I have it
                </button>
                <button
                  type="button"
                  onClick={() => { setForm({ ...form, hasPehchanCard: 'no' }); setArtisanCardFile(null); }}
                  className={`seller-toggle-btn ${form.hasPehchanCard === 'no' ? 'selected' : ''}`}
                >
                  ✕ No, I don't
                </button>
              </div>

              {form.hasPehchanCard === 'yes' && (
                <FileUploadBox
                  label="Upload Pehchan Card" accept="image/*,application/pdf"
                  file={artisanCardFile} onChange={setArtisanCardFile} required
                />
              )}
              {form.hasPehchanCard === 'no' && (
                <div className="seller-apply-box">
                  <div className="seller-apply-box-icon">🪪</div>
                  <div className="seller-apply-box-body">
                    <h4 className="seller-apply-box-title">Apply for Pehchan Card</h4>
                    <p className="seller-apply-box-desc">You can apply for your Artisan Identity Card through the official portal.</p>
                    <a href="https://www.craftcluster.in/" target="_blank" rel="noreferrer" className="seller-apply-link">Apply Now →</a>
                  </div>
                </div>
              )}
            </div>

            <div className="seller-field" style={{ marginBottom: '1.25rem' }}>
              <label className="seller-label">ID Proof Type <span className="req">*</span></label>
              <select
                required className="seller-select"
                value={form.idProofType} onChange={(e) => setForm({ ...form, idProofType: e.target.value })}
              >
                <option value="">Select document type</option>
                {ID_PROOF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <FileUploadBox
              label="Upload ID Proof" accept="image/*,application/pdf"
              file={idProofFile} onChange={setIdProofFile} required
            />

            <FileUploadBox
              label="Upload Business Proof (Optional)" accept="image/*,application/pdf"
              file={businessProofFile} onChange={setBusinessProofFile}
            />

            <FileUploadBox
              label="Upload Address Proof" accept="image/*,application/pdf"
              file={addressProofFile} onChange={setAddressProofFile} required
            />

            <FileUploadBox
              label="Upload Product Images (up to 5)" accept="image/*"
              file={productImages} onChange={setProductImages} required isMultiple={true}
            />
          </div>

          <button type="submit" disabled={loading} className="seller-btn-primary large" style={{ marginTop: '2rem' }}>
            {loading ? <><span className="spinner" /> Submitting Registration…</> : 'Submit Registration →'}
          </button>

          <p className="seller-footer-text">
            Your application will be reviewed by our team. You'll be notified via email once approved.
          </p>
        </form>
      </div>
    </div>
  );
}
