import React from 'react'

function Cta({setPage}) {
    return (
        <div style={{padding:'72px 20px',textAlign:'center',background:'var(--surface)'}}>
            <h2 style={{fontFamily:'var(--font-serif)',fontSize:'36px',marginBottom:'14px'}}>Start protecting your family today.</h2>
            <p style={{color:'var(--text-secondary)', marginBottom:'28px', fontSize:'16px'}}>Free · Private · Takes only 10 minutes</p>
            <button className="btn btn-primary btn-lg" onClick={() => setPage('auth')}>Create Free Account</button>
        </div>
    )
}

export default Cta