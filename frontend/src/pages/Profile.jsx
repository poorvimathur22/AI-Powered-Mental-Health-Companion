import React, { useState, useEffect } from 'react';
import { User, Camera, Save } from 'lucide-react';

const Profile = ({ user }) => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        dob: '',
        gender: '',
        country: '',
        profile_image: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/profile/me', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setProfile(data);
            if (data.profile_image) {
                setPreviewUrl(`http://localhost:5000${data.profile_image}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', profile.name);
        formData.append('dob', profile.dob);
        formData.append('gender', profile.gender);
        formData.append('country', profile.country);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await fetch('http://localhost:5000/api/profile/update', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });
            if (response.ok) {
                alert('Profile updated successfully!');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>My Profile</h2>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: '#f1f5f9',
                            margin: '0 auto',
                            overflow: 'hidden',
                            border: '4px solid white',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={64} color="#94a3b8" />
                            )}
                        </div>
                        <label style={{
                            position: 'absolute',
                            bottom: '0',
                            right: 'calc(50% - 60px)',
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Camera size={16} />
                            <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>

                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Full Name</label>
                            <input className="input" name="name" value={profile.name} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email (view only)</label>
                            <input className="input" value={profile.email} disabled style={{ background: '#f8fafc' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date of Birth</label>
                                <input className="input" type="date" name="dob" value={profile.dob} onChange={handleChange} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Gender</label>
                                <select className="input" name="gender" value={profile.gender} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Country</label>
                            <input className="input" name="country" value={profile.country} onChange={handleChange} />
                        </div>

                        <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
