import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Caught by ErrorBoundary:", error, errorInfo);
    // Ensure the raw HTML fallback is removed if React caught it,
    // to avoid duplicating the UI.
    const rawFallback = document.getElementById('fallback-error-ui');
    if (rawFallback) {
      rawFallback.style.display = 'none';
    }
  }

  render() {
    if (this.state.hasError) {
      // Callers may pass a graceful fallback (can be null to render nothing).
      if ('fallback' in this.props) return this.props.fallback;
      // Default: full-page error UI (used by the root boundary in main.jsx).
      return (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'#F5F0E8',zIndex:999999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',textAlign:'center',padding:'20px',boxSizing:'border-box'}}>
          <div style={{background:'white',padding:'40px',borderRadius:'24px',boxShadow:'0 10px 40px rgba(0,0,0,0.08)',maxWidth:'400px',border:'1px solid rgba(0,0,0,0.05)',width:'100%'}}>
            <div style={{width:'64px',height:'64px',background:'rgba(255,90,0,0.1)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px'}}>
              <svg style={{width:'32px',height:'32px',color:'#FF5A00'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 style={{fontSize:'22px',fontWeight:'700',margin:'0 0 12px',color:'#000'}}>Oops... Something snapped.</h2>
            <p style={{color:'#666',fontSize:'15px',lineHeight:'1.6',margin:'0 0 24px'}}>We blew a fuse trying to load this experience. If a quick reload doesn't jumpstart it, try viewing it on another browser.</p>
            <button onClick={() => window.location.reload()} style={{background:'#FF5A00',color:'white',border:'none',padding:'14px 24px',borderRadius:'12px',fontSize:'16px',fontWeight:'600',cursor:'pointer',width:'100%',transition:'opacity 0.2s'}}>Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
