import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Menu, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Box, FileText, Activity, Cpu, Truck, ShieldCheck, Sliders, Download, Lightbulb, ChevronRight, AlertCircle, ClipboardList, Target, Zap, Layers, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

type MessageType = 'user' | 'ai';
interface Message { id: string; type: MessageType; content: React.ReactNode; }

const Accordion = ({ title, count, children, defaultOpen = false, warning = false }: { title: string, count?: number, children: React.ReactNode, defaultOpen?: boolean, warning?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-lg mb-2 overflow-hidden bg-white">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          <span>{title} {count !== undefined && <span className="text-gray-500 font-normal">({count})</span>}</span>
        </div>
        {warning && <AlertTriangle size={16} className="text-orange-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 pt-1 text-sm text-gray-600 border-t border-gray-50">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden ${className}`}>{children}</div>
);

const ButtonOutline = ({ children, onClick, className = '', color = 'blue' }: { children: React.ReactNode, onClick?: () => void, className?: string, color?: 'blue' | 'red' | 'indigo' }) => {
  let colorClasses = 'border-blue-500 text-blue-500 hover:bg-blue-50';
  if (color === 'red') colorClasses = 'border-red-400 text-red-500 hover:bg-red-50';
  if (color === 'indigo') colorClasses = 'border-indigo-400 text-indigo-500 hover:bg-indigo-50';
  return <button onClick={onClick} className={`px-3 py-1 text-xs rounded border ${colorClasses} transition-colors flex items-center gap-1 ${className}`}>{children}</button>;
};

const ButtonSolid = ({ children, onClick, className = '', disabled = false }: { children: React.ReactNode, onClick?: () => void, className?: string, disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'} ${className}`}>{children}</button>
);

const PreJourneyCard = ({ onConfirm }: { onConfirm: () => void }) => (
  <Card className="mt-2 border-indigo-100 shadow-sm">
    <div className="p-4 border-b border-indigo-50 flex justify-between items-start bg-indigo-50/50">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Activity size={14} /></div>
        <span className="font-semibold text-gray-800 text-sm">智能业务进程识别</span>
      </div>
    </div>
    <div className="p-4">
      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
        基于您的项目台账与历史采购行为，需智已提前预测您的供应链意图：
      </p>
      
      <div className="bg-white border border-gray-100 rounded-lg p-3 mb-4 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 w-16">关联项目:</span>
          <span className="text-gray-800 font-medium">城南老旧小区改造二期工程 (施工中)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 w-16">历史偏好:</span>
          <span className="text-gray-800">高可靠性、对客诉(噪音)敏感</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 w-16">环境标签:</span>
          <div className="flex gap-1">
            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">即将入冬</span>
            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">空间受限</span>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4">
        <div className="text-xs font-semibold text-indigo-800 mb-1 flex items-center gap-1">
          <Target size={12} /> 预测核心采购需求
        </div>
        <div className="text-xs text-indigo-700">
          物资：<span className="font-bold">燃气调压箱及配套防冻物资</span><br/>
          数量：<span className="font-bold">约 10 台</span>
        </div>
      </div>

      <ButtonSolid onClick={onConfirm} className="w-full bg-indigo-600 hover:bg-indigo-700">确认预测，补充具体诉求</ButtonSolid>
    </div>
  </Card>
);

const ChatPromptHouseholds = ({ onSelect }: { onSelect: (val: string) => void }) => {
  const [selected, setSelected] = useState(false);
  return (
    <div>
      <p className="text-sm mb-2">收到！为老旧小区改造采购10台燃气调压箱。为了帮您精准推算设备参数，请问<strong>每个调压箱大约覆盖多少户居民</strong>？</p>
      {!selected && (
        <div className="flex gap-2 mt-2">
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("约300户"); }}>约300户</ButtonOutline>
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("约500户"); }}>约500户</ButtonOutline>
        </div>
      )}
    </div>
  );
};

const ChatPromptUsage = ({ onSelect }: { onSelect: (val: string) => void }) => {
  const [selected, setSelected] = useState(false);
  return (
    <div>
      <p className="text-sm mb-2">好的。请问这些居民的用气场景是<strong>仅做饭</strong>，还是<strong>做饭+壁挂炉采暖</strong>？这会直接影响流量测算。</p>
      {!selected && (
        <div className="flex gap-2 mt-2">
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("仅做饭"); }}>仅做饭</ButtonOutline>
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("做饭+采暖"); }}>做饭+采暖</ButtonOutline>
        </div>
      )}
    </div>
  );
};

const Step1ConfirmCard = ({ households, usage, onConfirm }: { households: string, usage: string, onConfirm: () => void }) => {
  const [confirmed, setConfirmed] = useState(false);
  const flowRate = usage === "做饭+采暖" ? (households === "约500户" ? "≥ 2000 Nm³/h" : "≥ 1200 Nm³/h") : (households === "约500户" ? "≥ 1000 Nm³/h" : "≥ 600 Nm³/h");

  return (
    <Card className="mt-2">
      <div className="p-3 border-b border-gray-50 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Cpu size={14} /></div>
        <span className="font-semibold text-gray-800 text-sm">参数推演结果</span>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="flex justify-between items-center"><span className="text-gray-500">推算流量需求:</span><span className="text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">{flowRate}</span></div>
        <div className="flex justify-between items-center"><span className="text-gray-500">默认进口压力:</span><span className="text-gray-800">0.2~0.4 MPa (中压A)</span></div>
        <div className="flex justify-between items-center"><span className="text-gray-500">默认出口压力:</span><span className="text-gray-800">2.0 kPa (低压)</span></div>
        <div className="bg-blue-50 text-blue-800 p-2 rounded text-[10px] mt-2 leading-relaxed">
          💡 提示：基于“老旧小区”场景，系统已自动匹配市政中压管网降压至居民低压的标准压力参数。
        </div>
        {!confirmed && (
          <ButtonSolid className="w-full mt-2" onClick={() => { setConfirmed(true); onConfirm(); }}>确认初步技术参数</ButtonSolid>
        )}
      </div>
    </Card>
  );
};

const Step2Card = ({ onNext }: { onNext: () => void }) => (
  <div className="space-y-3 mt-2">
    <Card>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /><span className="text-sm text-gray-800 font-medium">已完成&lt;初步需求&gt;测算与风险规避</span></div>
        <ChevronDown size={16} className="text-gray-400" />
      </div>
    </Card>
    <Card>
      <div className="p-4 border-b border-gray-50 flex justify-between items-start">
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><ClipboardList size={14} /></div><span className="font-semibold text-gray-800 text-sm">初步结构化需求说明书</span></div>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-800 mb-2">物资机理能力测算</h4>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-800 leading-relaxed"><span className="font-semibold">❄️ 极寒结冰风险拦截：</span>识别到“冬季极寒”工况，普通箱体易发生冷凝结冰导致压力失控。系统已强制为主设备增配 <span className="font-bold text-indigo-600">电伴热保温模块</span>。</div>
        </div>
        
        <Accordion title="基础物资属性规格参数" defaultOpen={true}>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">物资名称:</span><span className="text-gray-800 font-medium">燃气调压箱</span></div>
            <div className="flex justify-between"><span className="text-gray-500">采购数量:</span><span className="text-gray-800 font-medium">10 台</span></div>
            <div className="flex justify-between"><span className="text-gray-500">设计工作压力:</span><span className="text-gray-800 font-medium">0.4 MPa 转 2.0 kPa</span></div>
            <div className="flex justify-between"><span className="text-gray-500">稳态调压精度:</span><span className="text-blue-600 font-medium bg-blue-50 px-1 rounded">≤±10%</span></div>
            <div className="flex justify-between"><span className="text-gray-500">运行噪音限制:</span><span className="text-gray-800">≤55dB (近居民区)</span></div>
          </div>
        </Accordion>

        <Accordion title="特种工况与配套要求" defaultOpen={false}>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">防冷凝模块:</span><span className="text-indigo-600 font-medium">防冷凝加热型调压箱</span></div>
            <div className="flex justify-between"><span className="text-gray-500">安全监测配套:</span><span className="text-gray-800">防爆可燃气体探测器、智能压力监测终端</span></div>
            <div className="flex justify-between"><span className="text-gray-500">特种服务:</span><span className="text-gray-800">狭小空间吊装指导</span></div>
          </div>
        </Accordion>

        <Accordion title="初步 TCO 与交付评估" defaultOpen={true}>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center"><span className="text-gray-500">初期采购成本:</span><span className="text-indigo-500 font-medium">+15% (增配保温模块)</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-500">十年维保成本:</span><span className="text-green-600 font-medium">-30% (规避冻裂风险)</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-500">预计交期:</span><span className="text-gray-800 font-medium">15 天</span></div>
            <div className="h-px bg-gray-100 my-1"></div>
            <div className="flex justify-between items-center font-semibold text-sm"><span className="text-gray-800">全生命周期总账:</span><span className="text-green-600">绝对算赢 (节省12%)</span></div>
          </div>
        </Accordion>

        <Accordion title="物资质量判别方案" defaultOpen={false}>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">外观检查:</span><span className="text-gray-800">漆膜厚度≥80μm，无划痕脱落，箱体无变形</span></div>
            <div className="flex justify-between"><span className="text-gray-500">性能测试:</span><span className="text-gray-800">出厂前需提供 -20℃ 低温环境模拟测试报告及气密性测试报告</span></div>
            <div className="flex justify-between"><span className="text-gray-500">资质核验:</span><span className="text-gray-800">防爆合格证、特种设备制造许可证、核心部件材质单</span></div>
          </div>
        </Accordion>

        <ButtonSolid onClick={onNext} className="mt-4">查看3D仿真与个性化调节</ButtonSolid>
      </div>
    </Card>
  </div>
);

export interface ConfigState {
  days: number;
  material: number;
  insulation: 'basic' | 'advanced';
  telemetry: 'basic' | 'full';
}

const ValveModel = ({ config }: { config: ConfigState }) => {
  const materialProps = config.material > 50
    ? { color: '#e2e8f0', metalness: 0.8, roughness: 0.2 } // Stainless Steel
    : { color: '#475569', metalness: 0.4, roughness: 0.6 }; // Carbon Steel

  const heatGlowRef = useRef<THREE.Mesh>(null);
  const ledRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (heatGlowRef.current) {
      const mat = heatGlowRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.2 + Math.sin(clock.elapsedTime * 3) * 0.1;
    }
    if (ledRef.current) {
      ledRef.current.emissiveIntensity = Math.sin(clock.elapsedTime * 6) > 0 ? 2 : 0;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Main Pipe */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 4, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {/* Flanges */}
      <mesh position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {/* Valve Body */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {/* Diaphragm Casing */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.2, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {/* Spring Housing */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {/* Adjustment Screw */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Insulation Glow (Stress/Heat Simulation) */}
      {config.insulation === 'advanced' && (
        <mesh rotation={[0, 0, Math.PI / 2]} ref={heatGlowRef}>
          <cylinderGeometry args={[0.35, 0.35, 3.8, 32]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {/* Telemetry Box */}
      {config.telemetry === 'full' && (
        <group position={[0.6, 0.4, 0.4]}>
          <mesh>
            <boxGeometry args={[0.3, 0.4, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Antenna */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          {/* LED */}
          <mesh position={[0, 0.1, 0.11]}>
            <sphereGeometry args={[0.04]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" ref={ledRef} />
          </mesh>
        </group>
      )}
    </group>
  );
};

const Step3Card = ({ onNext }: { onNext: (config: ConfigState) => void }) => {
  const [config, setConfig] = useState<ConfigState>({ days: 15, material: 100, insulation: 'advanced', telemetry: 'full' });
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [savedConfigs, setSavedConfigs] = useState<(ConfigState & {id: string})[]>([]);

  const handleChange = (key: keyof ConfigState, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setIsCalculating(true);
    setShowResult(false);
    setTimeout(() => { setIsCalculating(false); setShowResult(true); }, 800);
  };

  const handleSaveConfig = () => {
    setSavedConfigs([...savedConfigs, { ...config, id: Date.now().toString() }]);
  };

  const loadConfig = (c: ConfigState) => {
    setConfig({ days: c.days, material: c.material, insulation: c.insulation, telemetry: c.telemetry });
    setIsCalculating(true);
    setShowResult(false);
    setTimeout(() => { setIsCalculating(false); setShowResult(true); }, 500);
  };

  const initialCost = 12000 + (config.material > 50 ? 6000 : 0) + (config.insulation === 'advanced' ? 3500 : 0) + (config.telemetry === 'full' ? 2500 : 0);
  const maintCost = (1500 + (config.material > 50 ? 0 : 1800) + (config.insulation === 'advanced' ? 0 : 2500) + (config.telemetry === 'full' ? 0 : 1200)) * 5; // 5-year maintenance
  const timeCost = (30 - config.days) * 600; // Expedite risk/cost

  const maxCost = 35000; // For scaling heights
  const initialCostHeight = Math.max(10, (initialCost / maxCost) * 100);
  const maintenanceCostHeight = Math.max(10, (maintCost / maxCost) * 100);
  const timeCostHeight = Math.max(10, (timeCost / maxCost) * 100);

  return (
    <Card className="mt-2">
      <div className="p-4 border-b border-gray-50 flex justify-between items-start">
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Box size={14} /></div><span className="font-semibold text-gray-800 text-sm">3D仿真与个性化调节</span></div>
      </div>
      <div className="p-4">
        <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 relative flex items-center justify-center border border-slate-200 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          <div className="absolute inset-0 z-10">
            <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Suspense fallback={null}>
                <Environment preset="city" />
                <ValveModel config={config} />
                <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              </Suspense>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
          </div>
          
          {/* Overlays */}
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            {config.telemetry === 'full' && <div className="bg-blue-900/90 text-white text-[10px] px-2 py-1 rounded shadow-md flex items-center gap-1 backdrop-blur-sm"><Activity size={10}/> 5G全量远传终端</div>}
            {config.insulation === 'advanced' && <div className="bg-orange-500/90 text-white text-[10px] px-2 py-1 rounded shadow-md flex items-center gap-1 backdrop-blur-sm"><Zap size={10}/> 防爆电伴热 (模拟开启)</div>}
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <div className="flex justify-between items-center mb-1"><label className="text-xs font-semibold text-gray-700">交期要求</label><span className="text-xs font-bold text-blue-600">{config.days} 天</span></div>
            <input type="range" min="7" max="30" value={config.days} onChange={(e) => handleChange('days', Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>加急 (7天)</span><span>常规 (30天)</span></div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1"><label className="text-xs font-semibold text-gray-700">管件材质</label><span className="text-xs font-bold text-blue-600">{config.material > 50 ? '304不锈钢' : '碳钢防腐'}</span></div>
            <input type="range" min="0" max="100" value={config.material} onChange={(e) => handleChange('material', Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>经济平替</span><span>高标原厂</span></div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-700 block mb-1">防冻保温等级</label>
              <select value={config.insulation} onChange={(e) => handleChange('insulation', e.target.value)} className="w-full text-xs border border-gray-200 rounded p-1.5 bg-gray-50 outline-none focus:border-blue-400">
                <option value="basic">标准保温棉</option>
                <option value="advanced">智能防爆电伴热</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-700 block mb-1">远传监控</label>
              <select value={config.telemetry} onChange={(e) => handleChange('telemetry', e.target.value)} className="w-full text-xs border border-gray-200 rounded p-1.5 bg-gray-50 outline-none focus:border-blue-400">
                <option value="basic">基础表计(人工抄表)</option>
                <option value="full">5G全量数据远传</option>
              </select>
            </div>
          </div>
        </div>

        {savedConfigs.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1"><Bookmark size={12} className="text-blue-500"/> 已存偏好组合</h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {savedConfigs.map((c, i) => (
                <div key={c.id} onClick={() => loadConfig(c)} className="shrink-0 bg-blue-50 border border-blue-100 rounded p-2 text-[10px] cursor-pointer hover:bg-blue-100 transition-colors">
                  <div className="font-semibold text-blue-800 mb-1">组合 {i + 1}</div>
                  <div className="text-gray-600">{c.days}天 | {c.material > 50 ? '不锈钢' : '碳钢'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-40 mb-4">
          <AnimatePresence mode="wait">
            {isCalculating && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center gap-2 text-blue-500">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-medium">逻辑本体重新推演算账中...</span>
              </motion.div>
            )}
            {showResult && !isCalculating && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col gap-2">
                <div className="bg-green-50 border border-green-100 rounded-lg p-2 text-xs text-green-800 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 font-semibold"><CheckCircle size={14} /> 方案已重构达标</div>
                  <div className="text-[10px] text-blue-600 cursor-pointer hover:underline" onClick={handleSaveConfig}>保存此组合</div>
                </div>
                
                <div className="flex-1 border border-gray-100 rounded bg-white p-2 flex flex-col">
                  <div className="text-[10px] text-gray-500 mb-1 font-semibold">TCO 多维对比图表</div>
                  <div className="flex-1 flex items-end gap-2 pt-2 h-24">
                    <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] text-blue-600 font-bold mb-0.5">¥{(initialCost/10000).toFixed(1)}万</span>
                      <div className="w-full bg-blue-400 rounded-t transition-all duration-500" style={{ height: `${initialCostHeight}%` }}></div>
                      <span className="text-[8px] text-gray-400">初期采购</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] text-indigo-600 font-bold mb-0.5">¥{(maintCost/10000).toFixed(1)}万</span>
                      <div className="w-full bg-indigo-400 rounded-t transition-all duration-500" style={{ height: `${maintenanceCostHeight}%` }}></div>
                      <span className="text-[8px] text-gray-400">5年维保</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] text-teal-600 font-bold mb-0.5">¥{(timeCost/10000).toFixed(1)}万</span>
                      <div className="w-full bg-teal-400 rounded-t transition-all duration-500" style={{ height: `${timeCostHeight}%` }}></div>
                      <span className="text-[8px] text-gray-400">时间/风险</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ButtonSolid onClick={() => onNext(config)} disabled={isCalculating || !showResult}>确认最终方案</ButtonSolid>
      </div>
    </Card>
  );
};

const Step4Card = ({ config, onNext }: { config: ConfigState, onNext: () => void }) => (
  <Card className="mt-2">
    <div className="p-4 border-b border-gray-50 flex justify-between items-start">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><ClipboardList size={14} /></div>
        <span className="font-semibold text-gray-800 text-sm">采购需求说明书</span>
      </div>
      <ButtonOutline color="blue"><Download size={12} className="mr-1" /> 导出</ButtonOutline>
    </div>
    <div className="p-4">
      <p className="text-xs text-gray-600 mb-4 leading-relaxed">系统已将您的个性化参数与底层物理流体规则结合，生成严密的《采购需求说明书》。</p>
      
      <Accordion title="基础物资属性规格参数" defaultOpen={true}>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">物资名称:</span><span className="text-gray-800 font-medium">燃气调压箱</span></div>
          <div className="flex justify-between"><span className="text-gray-500">采购数量:</span><span className="text-gray-800 font-medium">10 台</span></div>
          <div className="flex justify-between"><span className="text-gray-500">设计工作压力:</span><span className="text-gray-800 font-medium">2.0 kPa ±10% (1.8~2.2 kPa)</span></div>
          <div className="flex justify-between"><span className="text-gray-500">稳态调压精度:</span><span className="text-blue-600 font-medium bg-blue-50 px-1 rounded">≤±10%</span></div>
          <div className="flex justify-between"><span className="text-gray-500">管件材质:</span><span className="text-indigo-600 font-medium">{config.material > 50 ? '304不锈钢' : '碳钢防腐'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">运行噪音限制:</span><span className="text-gray-800">≤55dB (近居民区)</span></div>
        </div>
      </Accordion>

      <Accordion title="特种工况与配套要求" defaultOpen={false}>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">防冻保温等级:</span><span className="text-indigo-600 font-medium">{config.insulation === 'advanced' ? '智能防爆电伴热' : '标准保温棉'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">远传监控:</span><span className="text-indigo-600 font-medium">{config.telemetry === 'full' ? '5G全量数据远传' : '基础表计(人工抄表)'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">安全监测配套:</span><span className="text-gray-800">防爆可燃气体探测器、智能压力监测终端</span></div>
          <div className="flex justify-between"><span className="text-gray-500">特种服务:</span><span className="text-gray-800">狭小空间吊装指导</span></div>
        </div>
      </Accordion>

      <Accordion title="最优需求：质量、价格、交付" defaultOpen={true}>
        <div className="space-y-3 text-xs">
          <div className="bg-gray-50 p-2 rounded border border-gray-100">
            <div className="font-semibold text-gray-800 mb-1 flex items-center gap-1"><ShieldCheck size={12} className="text-green-500"/> 质量最优保障</div>
            <div className="text-gray-600">外观漆膜厚度≥80μm；出厂提供-20℃低温环境模拟测试报告；具备防爆合格证及特种设备制造许可证；核心焊缝探伤报告。</div>
          </div>
          <div className="bg-gray-50 p-2 rounded border border-gray-100">
            <div className="font-semibold text-gray-800 mb-1 flex items-center gap-1"><Activity size={12} className="text-blue-500"/> 价格(TCO)最优策略</div>
            <div className="text-gray-600">采用一体化防冷凝加热型调压箱。虽初期采购成本增加15%，但规避了冻裂风险，十年维保成本下降30%，全生命周期总账节省12%。</div>
          </div>
          <div className="bg-gray-50 p-2 rounded border border-gray-100">
            <div className="font-semibold text-gray-800 mb-1 flex items-center gap-1"><Truck size={12} className="text-indigo-500"/> 交付最优路径</div>
            <div className="text-gray-600">承诺 <span className="font-bold text-indigo-600">{config.days} 天</span> 内到货。针对老旧小区空间受限，采用模块化拆装设计，人工辅助小型卷扬机就位。</div>
          </div>
        </div>
      </Accordion>

      <Accordion title="可能的风险点和控制方案" defaultOpen={false}>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-start gap-2">
            <span className="text-gray-500 shrink-0">风险点:</span>
            <span className="text-gray-800 text-right">老旧小区空间受限，大型吊车无法进入</span>
          </div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-gray-500 shrink-0">控制方案:</span>
            <span className="text-indigo-600 font-medium text-right bg-indigo-50 px-1 rounded">采用模块化拆装设计，人工辅助小型卷扬机就位</span>
          </div>
          <div className="flex justify-between items-start gap-2 mt-2">
            <span className="text-gray-500 shrink-0">风险点:</span>
            <span className="text-gray-800 text-right">冬季极寒导致调压器膜片冻裂失效</span>
          </div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-gray-500 shrink-0">控制方案:</span>
            <span className="text-indigo-600 font-medium text-right bg-indigo-50 px-1 rounded">强制配置防爆电伴热及保温层，并接入智能远传终端实时监测温度</span>
          </div>
        </div>
      </Accordion>

      <Accordion title="物资质量判别方案" defaultOpen={false}>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">外观检查:</span><span className="text-gray-800">漆膜厚度≥80μm，无划痕脱落，箱体无变形</span></div>
          <div className="flex justify-between"><span className="text-gray-500">性能测试:</span><span className="text-gray-800">出厂前需提供 -20℃ 低温环境模拟测试报告及气密性测试报告</span></div>
          <div className="flex justify-between"><span className="text-gray-500">资质核验:</span><span className="text-gray-800">防爆合格证、特种设备制造许可证、核心部件材质单</span></div>
        </div>
      </Accordion>

      <Accordion title="可选替代方案" defaultOpen={false}>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">方案A (经济型):</span><span className="text-gray-800">常规调压箱 + 外部加装简易保温棚 (成本-10%，维保频次高)</span></div>
          <div className="flex justify-between"><span className="text-gray-500">方案B (推荐):</span><span className="text-blue-600 font-medium">一体化防冷凝加热型调压箱 (TCO最优)</span></div>
        </div>
      </Accordion>

      <ButtonSolid onClick={onNext} className="mt-4">共识并确认采购需求</ButtonSolid>
    </div>
  </Card>
);

const Step6Card = ({ config }: { config: ConfigState }) => (
  <Card className="mt-2 border-blue-200 shadow-[0_4px_20px_rgba(59,130,246,0.1)]">
    <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex justify-between items-center">
      <div className="flex items-center gap-2"><Target size={18} /><span className="font-semibold text-sm">供应商能力需求清单</span></div>
    </div>
    <div className="p-4">
      <p className="text-xs text-gray-600 mb-4 leading-relaxed">基于规格说明书，需智已将物资需求转化为对供应商的<span className="font-semibold text-blue-600">【能力标尺】</span>，用以精准寻源。</p>
      
      <div className="space-y-3 mb-5">
        <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors">
          <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0"><Truck size={16} /></div>
          <div>
            <div className="text-xs font-semibold text-gray-800 mb-1">履约交付能力</div>
            <div className="text-[10px] text-gray-600 leading-relaxed">需要具备根据客户给出时效（<span className="font-bold text-blue-600">{config.days}天</span>）准时排产与到货的敏捷物流能力。</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors">
          <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-orange-500 shrink-0"><Zap size={16} /></div>
          <div>
            <div className="text-xs font-semibold text-gray-800 mb-1">特种制造与防爆能力</div>
            <div className="text-[10px] text-gray-600 leading-relaxed">具备“防冷凝加热型调压箱”的定制组装与测试能力，确保稳态调压精度≤±10%，并能提供配套的防爆电源及防爆合格证。</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors">
          <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center text-green-600 shrink-0"><Layers size={16} /></div>
          <div>
            <div className="text-xs font-semibold text-gray-800 mb-1">现场服务与数智运维能力</div>
            <div className="text-[10px] text-gray-600 leading-relaxed">具备特种保温防护安装服务能力，及智能压力监测终端的数据远传对接能力，确保设备运行噪音≤55dB。</div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full mb-4"></div>

      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={14} className="text-green-500" />
          已同步生成《到货验收SOP》
        </div>
        <span className="text-[10px] text-blue-500 cursor-pointer hover:underline">预览SOP</span>
      </div>

      <ButtonSolid className="bg-blue-600 hover:bg-blue-700 shadow-md">
        一键发起全域寻源采购
      </ButtonSolid>
    </div>
  </Card>
);

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const addMessage = (type: MessageType, content: React.ReactNode) => setMessages(prev => [...prev, { id: Date.now().toString(), type, content }]);
  const simulateAI = (content: React.ReactNode, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => { setIsTyping(false); addMessage('ai', content); }, delay);
  };

  const startJourney = () => {
    simulateAI(<div><p className="text-sm mb-2">您好！我是需智。我察觉到您的项目进度有了新动向。</p><PreJourneyCard onConfirm={() => {
      addMessage('user', "是的，我要买10个燃气调压箱，居民小区改造用，最近冬天老降温，怕冻坏了影响供气，要尽快到货。");
      simulateAI(<ChatPromptHouseholds onSelect={(households) => {
        addMessage('user', households);
        simulateAI(<ChatPromptUsage onSelect={(usage) => {
          addMessage('user', usage);
          simulateAI(<div><p className="text-sm mb-2">明白。基于您的实际场景，系统已为您推算出核心技术参数。</p><Step1ConfirmCard households={households} usage={usage} onConfirm={() => {
            addMessage('user', "确认初步技术参数");
            simulateAI(<div><p className="text-sm mb-2">参数已锁定！正在为您进行物资机理能力测算与风险规避...</p><Step2Card onNext={() => {
              addMessage('user', "查看3D仿真与个性化调节");
              simulateAI(<div><p className="text-sm mb-2">已为您生成3D数字孪生视图，并扫描全国供应链产能库。请根据实际预算和工期，拖拽滑块进行个性化调节。</p><Step3Card onNext={(config) => {
                addMessage('user', "确认最终方案");
                simulateAI(<div><p className="text-sm mb-2">方案已锁定，正在为您生成最终的《采购需求说明书》...</p><Step4Card config={config} onNext={() => {
                  addMessage('user', "共识并确认采购需求");
                  simulateAI(<div><p className="text-sm mb-2">需求已确认并归档！您可以随时导出《采购需求说明书》进行后续采购流程。基于您的需求，已生成供应商能力标尺。</p><Step6Card config={config} /></div>);
                }} /></div>);
              }} /></div>);
            }} /></div>);
          }} /></div>);
        }} />);
      }} />);
    }} /></div>);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-gray-900 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3"><Menu size={20} className="text-gray-600" /><h1 className="font-semibold text-gray-800 text-lg">智能伙伴 - 需智</h1></div>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">智</div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-24">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4"><Lightbulb size={32} /></div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">欢迎使用需智智能体</h2>
            <p className="text-sm text-gray-500 max-w-[250px]">输入您的模糊诉求，我将为您精准定需、智能推演并生成极致采购标尺。</p>
            <ButtonSolid onClick={startJourney} className="mt-6 w-auto px-6">开始体验端到端旅程</ButtonSolid>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-2xl p-3.5 shadow-sm ${msg.type === 'user' ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'}`}>
                  {typeof msg.content === 'string' ? <p className="text-sm leading-relaxed">{msg.content}</p> : msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </main>
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
          <input type="text" placeholder="输入您的采购诉求..." className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" disabled />
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 opacity-50 cursor-not-allowed"><ChevronUp size={18} /></div>
        </div>
      </div>
    </div>
  );
}

