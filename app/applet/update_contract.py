with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('function renderDraftSetupView(c)')
if start_idx == -1:
    print('Error: renderDraftSetupView not found')
    exit(1)

# Find end of renderDraftSetupView function
# We can search for function renderGameplayView
end_idx = text.find('function renderGameplayView(c)')
if end_idx == -1:
    print('Error: renderGameplayView not found')
    exit(1)

new_func = '''function renderDraftSetupView(c) {
          c.innerHTML = `
            <div style="flex: 1; padding: 1.5rem 1rem; display: flex; flex-direction: column; background: #f7f4ea; color: #292524; font-family: sans-serif; max-width: 650px; margin: 0 auto; width: 100%; overflow-y: auto;">
              <!-- Navigation Header -->
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(120,53,15,0.15); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                <button id="btn-back-title" style="background: none; border: none; color: #78350f; font-size: 0.75rem; font-weight: bold; cursor: pointer;">← 返回主页</button>
                <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.7rem; font-family: monospace; color: #92400e; background: rgba(251,191,36,0.2); padding: 0.25rem 0.6rem; border-radius: 9999px; border: 1px solid rgba(245,158,11,0.4);">
                  <span>✨ 阳光校园风 · 职业契约签署</span>
                </div>
              </div>

              <!-- Physical Contract Paper Container -->
              <div style="position: relative; background: #fefcf0; border: 2px solid rgba(120,53,15,0.25); border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 20px 25px -5px rgba(120,53,15,0.1); margin-bottom: 1rem;">
                <!-- Watermark Seal -->
                <div style="position: absolute; right: 1.5rem; top: 1.5rem; width: 5rem; height: 5rem; border-radius: 50%; border: 3px solid rgba(185,28,28,0.3); display: flex; align-items: center; justify-content: center; transform: rotate(-12deg); pointer-events: none; opacity: 0.4;">
                  <div style="text-align: center; font-weight: bold; font-size: 0.55rem; color: #991b1b; line-height: 1.1;">
                    <div>官方认证</div>
                    <div style="font-size: 0.7rem;">VERIFIED</div>
                    <div>SPECIAL</div>
                  </div>
                </div>

                <!-- Contract Header -->
                <div style="text-align: center; padding-bottom: 1rem; border-bottom: 2px dashed rgba(120,53,15,0.2); margin-bottom: 1.25rem;">
                  <div style="font-size: 0.65rem; font-family: monospace; letter-spacing: 0.1em; color: #92400e; margin-bottom: 0.2rem;">NATIONAL COLLEGIATE ESPORTS & PRO ACADEMY</div>
                  <h2 style="font-size: 1.4rem; font-weight: 900; color: #451a03; font-family: serif; margin: 0;">职业电竞选手三方录用契约书</h2>
                  <p style="font-size: 0.7rem; color: #78350f; margin-top: 0.25rem;">请审阅并如实填写以下个人档案、生理特质与俱乐部归属，签字画押后生效。</p>
                </div>

                <!-- 1. Club Selection -->
                <div style="margin-bottom: 1rem;">
                  <label style="display: block; font-size: 0.75rem; font-weight: bold; color: #451a03; margin-bottom: 0.4rem;">1. 意向加入俱乐部 / 青训营</label>
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                    ${TEAMS.map(t => `
                      <div class="team-card" data-team-id="${t.id}" style="cursor: pointer; padding: 0.6rem; border: 1px solid ${t.id === gameState.selectedTeam ? '#b45309' : 'rgba(120,53,15,0.15)'}; background: ${t.id === gameState.selectedTeam ? 'rgba(254,243,199,0.9)' : 'rgba(255,255,255,0.7)'}; border-radius: 0.5rem; transition: all 0.2s;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.15rem;">
                          <strong style="font-size: 0.8rem; color: #451a03;">${t.name}</strong>
                          <span style="font-size: 0.6rem; background: #fef3c7; color: #92400e; padding: 0.1rem 0.35rem; border-radius: 0.25rem;">${t.badge.split(' · ')[0]}</span>
                        </div>
                        <p style="font-size: 0.65rem; color: #78350f; line-height: 1.3; margin: 0;">${t.desc}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- 2. Personal Profile -->
                <div style="margin-bottom: 1rem;">
                  <label style="display: block; font-size: 0.75rem; font-weight: bold; color: #451a03; margin-bottom: 0.4rem;">2. 乙方个人基础档案</label>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <div>
                      <label style="display: block; font-size: 0.65rem; color: #78350f; margin-bottom: 0.2rem;">真实姓名</label>
                      <input id="input-cname" type="text" value="${gameState.characterName || '林冬夏'}" placeholder="例如：林冬夏" style="width: 100%; background: white; border: 1px solid rgba(120,53,15,0.2); padding: 0.4rem 0.5rem; color: #292524; font-size: 0.8rem; border-radius: 0.35rem; outline: none;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.65rem; color: #78350f; margin-bottom: 0.2rem;">身高 (Height)</label>
                      <select id="select-height" style="width: 100%; background: white; border: 1px solid rgba(120,53,15,0.2); padding: 0.4rem 0.5rem; color: #292524; font-size: 0.8rem; border-radius: 0.35rem; outline: none;">
                        <option value="175cm" ${gameState.height === '175cm' ? 'selected' : ''}>175 cm (标准阳光)</option>
                        <option value="178cm" ${gameState.height === '178cm' ? 'selected' : ''}>178 cm (黄金比例)</option>
                        <option value="182cm" ${gameState.height === '182cm' || !gameState.height ? 'selected' : ''}>182 cm (挺拔高挑)</option>
                        <option value="185cm" ${gameState.height === '185cm' ? 'selected' : ''}>185 cm (模特身材)</option>
                        <option value="188cm" ${gameState.height === '188cm' ? 'selected' : ''}>188 cm (绝对压迫感)</option>
                      </select>
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <div>
                      <label style="display: block; font-size: 0.65rem; color: #78350f; margin-bottom: 0.2rem;">样貌特征选择</label>
                      <select id="select-appearance" style="width: 100%; background: white; border: 1px solid rgba(120,53,15,0.2); padding: 0.4rem 0.5rem; color: #292524; font-size: 0.8rem; border-radius: 0.35rem; outline: none;">
                        <option value="阳光清爽短发·纯净少年感">阳光清爽短发·纯净少年感</option>
                        <option value="锐利深邃电眼·压迫感校草">锐利深邃电眼·压迫感校草</option>
                        <option value="慵懒天才网瘾少年·略带颓废美">慵懒天才网瘾少年·略带颓废美</option>
                        <option value="阳光运动系大男孩·肩宽窄腰">阳光运动系大男孩·肩宽窄腰</option>
                      </select>
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.65rem; color: #78350f; margin-bottom: 0.2rem;">擅长主战位置</label>
                      <select id="select-role" style="width: 100%; background: white; border: 1px solid rgba(120,53,15,0.2); padding: 0.4rem 0.5rem; color: #292524; font-size: 0.8rem; border-radius: 0.35rem; outline: none;">
                        ${ROLES.map(r => `<option value="${r.id}" ${r.id === gameState.selectedRole ? 'selected' : ''}>${r.id} // ${r.label}</option>`).join('')}
                      </select>
                    </div>
                  </div>
                </div>

                <!-- 3. Adult & Physical Attributes -->
                <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(254,243,199,0.5); border: 1px solid rgba(120,53,15,0.15); border-radius: 0.5rem;">
                  <label style="display: block; font-size: 0.75rem; font-weight: bold; color: #451a03; margin-bottom: 0.4rem;">3. 个人核心生理与耐力特质申报</label>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <div>
                      <label style="display: block; font-size: 0.65rem; color: #78350f; margin-bottom: 0.2rem;">阴茎长度 (Penile Length)</label>
                      <select id="select-penile" style="width: 100%; background: white; border: 1px solid rgba(120,53,15,0.2); padding: 0.4rem 0.5rem; color: #292524; font-size: 0.8rem; border-radius: 0.35rem; outline: none;">
                        <option value="16.0 cm (标准阳光男大)">16.0 cm (标准阳光男大)</option>
                        <option value="18.5 cm (天赋异禀·巨物级)" selected>18.5 cm (天赋异禀·巨物级)</option>
                        <option value="20.0 cm (极罕见战神级天赋)">20.0 cm (极罕见战神级天赋)</option>
                        <option value="22.0 cm (传说级·压迫感拉满)">22.0 cm (传说级·压迫感拉满)</option>
                      </select>
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.65rem; color: #78350f; margin-bottom: 0.2rem;">耐力持久与爆发特质</label>
                      <select id="select-endurance" style="width: 100%; background: white; border: 1px solid rgba(120,53,15,0.2); padding: 0.4rem 0.5rem; color: #292524; font-size: 0.8rem; border-radius: 0.35rem; outline: none;">
                        <option value="持续作战 (鏖战五局不泄)" selected>持续作战 (鏖战五局不泄)</option>
                        <option value="极强爆发 (瞬间输出极高)">极强爆发 (瞬间输出极高)</option>
                        <option value="铁人三项 (全天候高压对抗)">铁人三项 (全天候高压对抗)</option>
                        <option value="意犹未尽 (夜间加训战神)">意犹未尽 (夜间加训战神)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Contract Footer & Signature -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px dashed rgba(120,53,15,0.2); padding-top: 1rem; margin-top: 1rem;">
                  <div style="font-size: 0.7rem; color: #78350f;">
                    <div>乙方签字：<strong style="font-family: serif; font-size: 0.9rem; color: #451a03; border-bottom: 1px solid #b45309;" id="signature-preview">${gameState.characterName || '林冬夏'}</strong></div>
                    <div style="font-size: 0.6rem; color: #92400e; margin-top: 0.15rem;">签字即代表同意服从俱乐部一切战术调配。</div>
                  </div>
                  <button id="btn-confirm-draft" style="background: #b45309; color: white; border: none; padding: 0.75rem 1.5rem; font-weight: bold; font-size: 0.85rem; border-radius: 0.5rem; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(180,83,9,0.3);">
                    签字画押 · 正式入队开启剧情 →
                  </button>
                </div>
              </div>
            </div>
            ${renderAllModals()}
          `;

          document.getElementById('btn-back-title').onclick = () => {
            playSfx('click');
            gameState.stage = 'TITLE';
            render();
          };
          const nameInput = document.getElementById('input-cname');
          if (nameInput) {
            nameInput.oninput = (e) => {
              gameState.characterName = e.target.value.trim() || '林冬夏';
              const sig = document.getElementById('signature-preview');
              if (sig) sig.textContent = gameState.characterName;
            };
          }
          c.querySelectorAll('.team-card').forEach(el => {
            el.onclick = () => {
              playSfx('click');
              gameState.selectedTeam = el.getAttribute('data-team-id');
              render();
            };
          });
          document.getElementById('btn-confirm-draft').onclick = () => {
            playSfx('confirm');
            const hElem = document.getElementById('select-height');
            const aElem = document.getElementById('select-appearance');
            const rElem = document.getElementById('select-role');
            const pElem = document.getElementById('select-penile');
            const eElem = document.getElementById('select-endurance');
            if (hElem) gameState.height = hElem.value;
            if (aElem) gameState.appearance = aElem.value;
            if (rElem) gameState.selectedRole = rElem.value;
            if (pElem) gameState.penileLength = pElem.value;
            if (eElem) gameState.endurance = eElem.value;
            gameState.stage = 'GAMEPLAY';
            triggerAutoSave();
            render();
          };
          attachModals();
        }'''

updated_text = text[:start_idx] + new_func + text[end_idx:]
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(updated_text)
print('Successfully updated index.html with Sunny Campus Contract Setup view!')
'''

with open('update_contract.py', 'w', encoding='utf-8') as f:
    f.write(script_content)

print('Created update_contract.py')
