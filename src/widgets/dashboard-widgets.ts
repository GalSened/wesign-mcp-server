/**
 * Dashboard Widgets for ChatGPT Visual Display
 * Creates interactive, beautiful widgets that render inline in ChatGPT
 */

export class DashboardWidgets {

  /**
   * Generate Account Dashboard Widget
   */
  static generateAccountDashboard(user: any): string {
    const remaining = user.program?.remainingDocumentsForMonth || 0;
    const used = user.program?.currentMonthDocumentsCount || 0;
    const total = remaining + used;
    const usagePercent = total > 0 ? (used / total) * 100 : 0;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .dashboard {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 0 30px 90px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
            overflow: hidden;
          }
          .dashboard-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 40px;
            text-align: center;
          }
          .dashboard-header h1 {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -1px;
          }
          .dashboard-header p {
            font-size: 16px;
            opacity: 0.9;
          }
          .dashboard-content {
            padding: 40px;
          }
          .user-card {
            background: linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%);
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          }
          .user-name {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
          }
          .user-email {
            font-size: 14px;
            color: #666;
            margin-bottom: 12px;
          }
          .user-company {
            display: inline-block;
            background: #667eea;
            color: #fff;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
          }
          .usage-card {
            background: #fff;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          }
          .usage-title {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .usage-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 25px;
          }
          .stat-box {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
            border-radius: 12px;
          }
          .stat-value {
            font-size: 42px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
          }
          .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }
          .progress-container {
            margin-top: 25px;
          }
          .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 13px;
            color: #666;
            font-weight: 600;
          }
          .progress-bar {
            width: 100%;
            height: 12px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #34d399);
            border-radius: 10px;
            width: ${usagePercent}%;
            transition: width 0.5s ease;
          }
          .dashboard-footer {
            background: #f6f8fb;
            padding: 25px 40px;
            text-align: center;
            color: #666;
            font-size: 13px;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #10b981;
            color: #fff;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 15px;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            background: #fff;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        </style>
      </head>
      <body>
        <div class="dashboard">
          <div class="dashboard-header">
            <h1>🎯 WeSign Dashboard</h1>
            <p>Your digital signature control center</p>
          </div>

          <div class="dashboard-content">
            <div class="user-card">
              <div class="user-name">${user.name}</div>
              <div class="user-email">✉️ ${user.email}</div>
              ${user.companyName ? `<div class="user-company">🏢 ${user.companyName}</div>` : ''}
              <div class="status-badge">
                <div class="status-dot"></div>
                Active Session
              </div>
            </div>

            <div class="usage-card">
              <div class="usage-title">
                <span>📊</span>
                Document Usage This Month
              </div>

              <div class="usage-stats">
                <div class="stat-box">
                  <div class="stat-value">${used}</div>
                  <div class="stat-label">Used</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value">${remaining}</div>
                  <div class="stat-label">Remaining</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value">${total}</div>
                  <div class="stat-label">Total</div>
                </div>
              </div>

              <div class="progress-container">
                <div class="progress-label">
                  <span>Usage Progress</span>
                  <span>${usagePercent.toFixed(0)}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="dashboard-footer">
            🔐 Secure connection • Last updated: ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate Documents Gallery Widget
   */
  static generateDocumentsGallery(documents: any[]): string {
    const docCards = documents.slice(0, 12).map(doc => {
      const statusColors: Record<number, { bg: string; text: string; label: string }> = {
        0: { bg: '#3b82f6', text: '#fff', label: 'DRAFT' },
        1: { bg: '#f59e0b', text: '#fff', label: 'PENDING' },
        2: { bg: '#10b981', text: '#fff', label: 'COMPLETED' },
        3: { bg: '#ef4444', text: '#fff', label: 'CANCELLED' },
      };

      const status = statusColors[doc.status] || statusColors[0];
      const date = new Date(doc.createdOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      return `
        <div class="doc-card">
          <div class="doc-icon">📄</div>
          <div class="doc-content">
            <div class="doc-title">${doc.name || 'Untitled Document'}</div>
            <div class="doc-meta">${date}</div>
            <div class="doc-files">${doc.documents?.length || 0} file(s)</div>
          </div>
          <div class="doc-status" style="background: ${status.bg}; color: ${status.text};">
            ${status.label}
          </div>
        </div>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
          }
          .gallery-container {
            max-width: 1200px;
            margin: 0 auto;
          }
          .gallery-header {
            text-align: center;
            color: #fff;
            margin-bottom: 40px;
          }
          .gallery-header h1 {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -1px;
          }
          .gallery-header p {
            font-size: 18px;
            opacity: 0.9;
          }
          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 25px;
          }
          .doc-card {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
          }
          .doc-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 45px rgba(0,0,0,0.3);
          }
          .doc-icon {
            font-size: 48px;
            margin-bottom: 15px;
          }
          .doc-content {
            margin-bottom: 15px;
          }
          .doc-title {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
            line-height: 1.3;
          }
          .doc-meta {
            font-size: 13px;
            color: #666;
            margin-bottom: 4px;
          }
          .doc-files {
            font-size: 12px;
            color: #999;
          }
          .doc-status {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        </style>
      </head>
      <body>
        <div class="gallery-container">
          <div class="gallery-header">
            <h1>📚 Documents Gallery</h1>
            <p>${documents.length} document collections</p>
          </div>

          <div class="gallery-grid">
            ${docCards || '<p style="color: #fff; text-align: center;">No documents found</p>'}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate Templates Showcase Widget
   */
  static generateTemplatesShowcase(templates: any[]): string {
    const templateCards = templates.slice(0, 9).map(tmpl => {
      const date = new Date(tmpl.createdOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const usage = tmpl.usageCount || 0;

      return `
        <div class="template-card">
          <div class="template-header">
            <div class="template-icon">📝</div>
            <div class="template-usage">${usage} uses</div>
          </div>
          <div class="template-title">${tmpl.name || 'Untitled Template'}</div>
          <div class="template-description">${tmpl.description || 'No description'}</div>
          <div class="template-footer">
            <span class="template-date">📅 ${date}</span>
            <span class="template-id">#${tmpl.id}</span>
          </div>
        </div>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
          }
          .showcase-container {
            max-width: 1200px;
            margin: 0 auto;
          }
          .showcase-header {
            text-align: center;
            color: #fff;
            margin-bottom: 40px;
          }
          .showcase-header h1 {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -1px;
          }
          .showcase-header p {
            font-size: 18px;
            opacity: 0.9;
          }
          .template-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
          }
          .template-card {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
            display: flex;
            flex-direction: column;
          }
          .template-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 45px rgba(0,0,0,0.3);
          }
          .template-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }
          .template-icon {
            font-size: 36px;
          }
          .template-usage {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
          }
          .template-title {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 10px;
            line-height: 1.3;
          }
          .template-description {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
            flex-grow: 1;
            line-height: 1.5;
          }
          .template-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #999;
          }
          .template-id {
            background: #f3f4f6;
            padding: 4px 10px;
            border-radius: 12px;
            font-weight: 600;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="showcase-container">
          <div class="showcase-header">
            <h1>🎨 Template Showcase</h1>
            <p>${templates.length} reusable document templates</p>
          </div>

          <div class="template-grid">
            ${templateCards || '<p style="color: #fff; text-align: center;">No templates found</p>'}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate Signature Success Animation
   */
  static generateSignatureSuccess(documentName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .success-container {
            text-align: center;
            color: #fff;
          }
          .checkmark-circle {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            animation: scaleIn 0.5s ease-out;
          }
          .checkmark {
            font-size: 80px;
            animation: slideIn 0.5s ease-out 0.2s both;
          }
          .success-title {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 15px;
            animation: fadeIn 0.5s ease-out 0.4s both;
          }
          .success-message {
            font-size: 20px;
            opacity: 0.9;
            margin-bottom: 30px;
            animation: fadeIn 0.5s ease-out 0.6s both;
          }
          .document-name {
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            padding: 20px 30px;
            border-radius: 16px;
            display: inline-block;
            font-size: 18px;
            animation: fadeIn 0.5s ease-out 0.8s both;
          }
          @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(-30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      </head>
      <body>
        <div class="success-container">
          <div class="checkmark-circle">
            <div class="checkmark">✓</div>
          </div>
          <h1 class="success-title">Signature Complete!</h1>
          <p class="success-message">Your document has been successfully signed</p>
          <div class="document-name">📄 ${documentName}</div>
        </div>
      </body>
      </html>
    `;
  }
}
