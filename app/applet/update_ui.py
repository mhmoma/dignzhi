with open('/app/applet/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add battleMetrics to gameState
gs_target = 'playerProfile: JSON.parse(JSON.stringify(INITIAL_PLAYER_PROFILE)),'
gs_replacement = 'playerProfile: JSON.parse(JSON.stringify(INITIAL_PLAYER_PROFILE)), battleMetrics: { kdaContribution: 88, jungleAggression: 92, laneControlRate: 82 },'

if gs_target in text:
    text = text.replace(gs_target, gs_replacement, 1)
else:
    print('Warning: gs_target not found')

# 2. Update runStoryStep to update battleMetrics
run_target = 'if (data && data.narrative) response = data;'
run_replacement = 'if (data && data.narrative) { response = data; if (data.battleMetrics) gameState.battleMetrics = data.battleMetrics; }'

if run_target in text:
    text = text.replace(run_target, run_replacement, 1)
else:
    print('Warning: run_target not found')

# 3. Add Battle Dashboard in renderGameplayView before Narrative Card
card_target = '<!-- Narrative Card -->'
dashboard_html = '''<!-- Battle Status Dashboard -->
              <div class="card" style="margin-bottom: 0.65rem; padding: 0.65rem 0.85rem; background: rgba(10, 24, 45, 0.8); border: 1px solid var(--border-subtle);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <div style="font-size: 0.7rem; font-weight: 800; color: var(--accent-cyan); font-family: monospace; display: flex; align-items: center; gap: 0.3rem;">
                    <span>⚡</span> 实时战况仪表盘 // BATTLE DASHBOARD
                  </div>
                  <div style="font-size: 0.6rem; color: var(--text-muted); font-family: monospace;">AI DYNAMIC METRICS</div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.65rem; font-family: monospace; margin-bottom: 0.2rem;">
                      <span style="color: #cbd5e1;">KDA贡献度</span>
                      <span style="color: #38bdf8; font-weight: 700;">${gameState.battleMetrics?.kdaContribution ?? 88}%</span>
                    </div>
                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.08); overflow: hidden;">
                      <div style="width: ${gameState.battleMetrics?.kdaContribution ?? 88}%; height: 100%; background: linear-gradient(90deg, #00f0ff, #3b82f6); transition: width 0.5s ease;"></div>
                    </div>
                  </div>
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.65rem; font-family: monospace; margin-bottom: 0.2rem;">
                      <span style="color: #cbd5e1;">野区侵略度</span>
                      <span style="color: #34d399; font-weight: 700;">${gameState.battleMetrics?.jungleAggression ?? 92}%</span>
                    </div>
                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.08); overflow: hidden;">
                      <div style="width: ${gameState.battleMetrics?.jungleAggression ?? 92}%; height: 100%; background: linear-gradient(90deg, #10b981, #34d399); transition: width 0.5s ease;"></div>
                    </div>
                  </div>
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.65rem; font-family: monospace; margin-bottom: 0.2rem;">
                      <span style="color: #cbd5e1;">兵线控制率</span>
                      <span style="color: #a78bfa; font-weight: 700;">${gameState.battleMetrics?.laneControlRate ?? 82}%</span>
                    </div>
                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.08); overflow: hidden;">
                      <div style="width: ${gameState.battleMetrics?.laneControlRate ?? 82}%; height: 100%; background: linear-gradient(90deg, #8b5cf6, #a78bfa); transition: width 0.5s ease;"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Narrative Card -->'''

if card_target in text:
    text = text.replace(card_target, dashboard_html, 1)
else:
    print('Warning: card_target not found')

with open('/app/applet/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully updated index.html')
