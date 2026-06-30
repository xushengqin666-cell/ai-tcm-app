/**
 * 彩云智药 - 认证模块
 * 支持邮箱验证码登录 + 微信登录（后续）
 */

(function() {
  'use strict';

  // 登录弹窗 HTML
  const AUTH_MODAL_HTML = `
    <div id="authModal" class="auth-modal" style="display:none">
      <div class="auth-modal-content">
        <button class="auth-close" onclick="hideAuthModal()">×</button>
        
        <div class="auth-header">
          <div class="auth-logo">💊</div>
          <h2>彩云智药</h2>
          <p>登录后数据自动同步到云端</p>
        </div>

        <div id="authStepEmail" class="auth-step">
          <div class="auth-form-group">
            <label>邮箱地址</label>
            <input type="email" id="authEmail" placeholder="请输入邮箱">
          </div>
          <button class="auth-btn auth-btn-primary" onclick="sendOTPCode()">
            发送验证码
          </button>
        </div>

        <div id="authStepOTP" class="auth-step" style="display:none">
          <div class="auth-form-group">
            <label>验证码（已发送到 <span id="authEmailDisplay"></span>）</label>
            <input type="text" id="authOTP" placeholder="请输入6位验证码" maxlength="6">
          </div>
          <button class="auth-btn auth-btn-primary" onclick="verifyOTPCode()">
            登录
          </button>
          <button class="auth-btn auth-btn-secondary" onclick="backToEmail()">
            返回修改邮箱
          </button>
        </div>

        <div id="authStepSuccess" class="auth-step" style="display:none">
          <div class="auth-success-icon">✅</div>
          <h3>登录成功</h3>
          <p>数据已同步到云端</p>
          <button class="auth-btn auth-btn-primary" onclick="hideAuthModal()">
            开始使用
          </button>
        </div>

        <div class="auth-divider">
          <span>其他登录方式（即将支持）</span>
        </div>

        <button class="auth-btn auth-btn-wechat" disabled>
          <span class="wechat-icon">💬</span> 微信扫码登录（敬请期待）
        </button>

        <div class="auth-footer">
          <p>登录即表示同意 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a></p>
        </div>
      </div>
    </div>

    <style>
      .auth-modal {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
      }
      .auth-modal-content {
        background: #fff;
        border-radius: 16px;
        padding: 32px 24px;
        width: 100%;
        max-width: 360px;
        position: relative;
        animation: authSlideUp .3s ease;
      }
      @keyframes authSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .auth-close {
        position: absolute;
        top: 12px;
        right: 16px;
        background: none;
        border: none;
        font-size: 24px;
        color: #999;
        cursor: pointer;
      }
      .auth-close:hover { color: #333; }
      .auth-header {
        text-align: center;
        margin-bottom: 24px;
      }
      .auth-logo {
        font-size: 48px;
        margin-bottom: 12px;
      }
      .auth-header h2 {
        font-size: 22px;
        margin: 0 0 8px;
        color: #2e7d32;
      }
      .auth-header p {
        font-size: 13px;
        color: #888;
        margin: 0;
      }
      .auth-step {
        margin-bottom: 20px;
      }
      .auth-form-group {
        margin-bottom: 16px;
      }
      .auth-form-group label {
        display: block;
        font-size: 13px;
        color: #666;
        margin-bottom: 6px;
        font-weight: 600;
      }
      .auth-form-group input {
        width: 100%;
        padding: 12px 14px;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        font-size: 15px;
        outline: none;
        transition: border-color .2s;
      }
      .auth-form-group input:focus {
        border-color: #2e7d32;
      }
      .auth-btn {
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all .2s;
      }
      .auth-btn-primary {
        background: #2e7d32;
        color: #fff;
      }
      .auth-btn-primary:hover {
        background: #1b5e20;
      }
      .auth-btn-secondary {
        background: #f5f5f5;
        color: #666;
        margin-top: 10px;
      }
      .auth-btn-wechat {
        background: #07c160;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .auth-btn-wechat:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
      .wechat-icon {
        font-size: 18px;
      }
      .auth-divider {
        text-align: center;
        margin: 20px 0;
        position: relative;
      }
      .auth-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: #e0e0e0;
      }
      .auth-divider span {
        background: #fff;
        padding: 0 12px;
        position: relative;
        font-size: 12px;
        color: #999;
      }
      .auth-footer {
        text-align: center;
        margin-top: 20px;
      }
      .auth-footer p {
        font-size: 11px;
        color: #999;
        margin: 0;
      }
      .auth-footer a {
        color: #2e7d32;
        text-decoration: none;
      }
      .auth-success-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }
      #authStepSuccess {
        text-align: center;
      }
      #authStepSuccess h3 {
        color: #2e7d32;
        margin: 0 0 8px;
      }
      #authStepSuccess p {
        color: #888;
        font-size: 13px;
        margin: 0 0 20px;
      }
    </style>
  `;

  // 当前登录邮箱
  let currentEmail = '';

  // 显示登录弹窗
  window.showAuthModal = function() {
    if (!document.getElementById('authModal')) {
      document.body.insertAdjacentHTML('beforeend', AUTH_MODAL_HTML);
    }
    document.getElementById('authModal').style.display = 'flex';
    resetAuthSteps();
  };

  // 隐藏登录弹窗
  window.hideAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
  };

  // 重置步骤
  function resetAuthSteps() {
    document.getElementById('authStepEmail').style.display = 'block';
    document.getElementById('authStepOTP').style.display = 'none';
    document.getElementById('authStepSuccess').style.display = 'none';
    document.getElementById('authEmail').value = '';
    document.getElementById('authOTP').value = '';
  }

  // 发送验证码
  window.sendOTPCode = async function() {
    const email = document.getElementById('authEmail').value.trim();
    if (!email) {
      alert('请输入邮箱地址');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('请输入正确的邮箱格式');
      return;
    }

    currentEmail = email;

    const supabase = window.pharmacySupabase?.getClient();
    if (!supabase) {
      alert('系统未初始化，请刷新页面重试');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // 显示输入验证码步骤
      document.getElementById('authStepEmail').style.display = 'none';
      document.getElementById('authStepOTP').style.display = 'block';
      document.getElementById('authEmailDisplay').textContent = email;

    } catch (err) {
      console.error('[Auth] 发送验证码失败:', err);
      alert('发送失败: ' + (err.message || '请稍后重试'));
    }
  };

  // 验证验证码
  window.verifyOTPCode = async function() {
    const otp = document.getElementById('authOTP').value.trim();
    if (!otp || otp.length !== 6) {
      alert('请输入6位验证码');
      return;
    }

    const supabase = window.pharmacySupabase?.getClient();
    if (!supabase) {
      alert('系统未初始化，请刷新页面重试');
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: currentEmail,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      // 登录成功
      console.log('[Auth] 登录成功');
      document.getElementById('authStepOTP').style.display = 'none';
      document.getElementById('authStepSuccess').style.display = 'block';

      // 触发同步
      if (window.pharmacySync) {
        window.pharmacySync.pullFromCloud();
      }

      // 更新UI
      updateAuthUI(true);

    } catch (err) {
      console.error('[Auth] 验证失败:', err);
      alert('验证失败: ' + (err.message || '请检查验证码'));
    }
  };

  // 返回邮箱输入
  window.backToEmail = function() {
    document.getElementById('authStepOTP').style.display = 'none';
    document.getElementById('authStepEmail').style.display = 'block';
  };

  // 登出
  window.logout = async function() {
    const supabase = window.pharmacySupabase?.getClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('pharmacy_user');
    updateAuthUI(false);
    alert('已退出登录');
  };

  // 更新UI显示登录状态
  function updateAuthUI(loggedIn) {
    const userInfo = document.getElementById('userInfo');
    if (!userInfo) return;

    if (loggedIn) {
      userInfo.innerHTML = `
        <span class="user-badge" onclick="showUserMenu()">👤 已登录</span>
      `;
    } else {
      userInfo.innerHTML = `
        <button class="login-btn" onclick="showAuthModal()">登录/注册</button>
      `;
    }
  }

  // 初始化时检查登录状态
  async function initAuth() {
    const supabase = window.pharmacySupabase?.init();
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    updateAuthUI(!!session);

    // 监听登录状态变化
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] 状态变化:', event);
      updateAuthUI(!!session);

      if (event === 'SIGNED_IN') {
        window.pharmacySync?.pullFromCloud();
      }
    });
  }

  // 页面加载后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }

})();
