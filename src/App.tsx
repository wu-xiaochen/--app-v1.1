import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Menu, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Box, FileText, Activity, Cpu, Truck, ShieldCheck, Sliders, Download, Lightbulb, ChevronRight, AlertCircle, ClipboardList, Target, Zap, Layers, Bookmark, GitMerge, Search, Eye, Wind, TrendingUp } from 'lucide-react';
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
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-2 text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
          <span>{title} {count !== undefined && <span className="text-gray-500 font-normal">({count})</span>}</span>
        </div>
        {warning && <AlertTriangle size={14} className="text-orange-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-3 pb-3 pt-1 text-xs text-gray-600 border-t border-gray-50">
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

const ButtonOutline = ({ children, onClick, className = '', color = 'blue' }: { children: React.ReactNode, onClick?: () => void, className?: string, color?: 'blue' | 'red' | 'indigo' | 'green' }) => {
  let colorClasses = 'border-blue-500 text-blue-500 hover:bg-blue-50';
  if (color === 'red') colorClasses = 'border-red-400 text-red-500 hover:bg-red-50';
  if (color === 'indigo') colorClasses = 'border-indigo-400 text-indigo-500 hover:bg-indigo-50';
  if (color === 'green') colorClasses = 'border-green-400 text-green-500 hover:bg-green-50';
  return <button onClick={onClick} className={`px-3 py-1 text-xs rounded border ${colorClasses} transition-colors flex items-center gap-1 ${className}`}>{children}</button>;
};

const ButtonSolid = ({ children, onClick, className = '', disabled = false }: { children: React.ReactNode, onClick?: () => void, className?: string, disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className={`w-full py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'} ${className}`}>{children}</button>
);

const PreJourneyCard = ({ onConfirm }: { onConfirm: () => void }) => (
  <Card className="mt-2 border-indigo-100 shadow-sm">
    <div className="p-2 border-b border-indigo-50 flex justify-between items-start bg-indigo-50/50">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Activity size={12} /></div>
        <span className="font-semibold text-gray-800 text-xs">智能业务进程识别</span>
      </div>
    </div>
    <div className="p-2">
      <p className="text-[10px] text-gray-600 mb-2 leading-relaxed">
        基于您的项目台账与历史采购行为，需智已提前预测您的供应链意图：
      </p>
      
      <div className="bg-white border border-gray-100 rounded-lg p-2 mb-2 space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-gray-500 w-14">关联项目:</span>
          <span className="text-gray-800 font-medium">城南老旧小区改造二期工程</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-gray-500 w-14">历史偏好:</span>
          <span className="text-gray-800">高可靠性、对客诉敏感</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-gray-500 w-14">环境标签:</span>
          <div className="flex gap-1">
            <span className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded text-[9px]">即将入冬</span>
            <span className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded text-[9px]">空间受限</span>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 mb-2">
        <div className="text-[10px] font-semibold text-indigo-800 mb-0.5 flex items-center gap-1">
          <Target size={10} /> 预测核心采购需求
        </div>
        <div className="text-[10px] text-indigo-700">
          物资：<span className="font-bold">燃气调压箱及配套防冻物资</span><br/>
          数量：<span className="font-bold">约 10 台</span>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 mb-3">
        <div className="text-[10px] font-semibold text-orange-800 mb-0.5 flex items-center gap-1">
          <AlertTriangle size={10} /> 潜在采购风险提示
        </div>
        <div className="text-[10px] text-orange-800 leading-relaxed">
          老旧小区改造通常伴随<span className="font-bold">空间狭小</span>和<span className="font-bold">居民扰民投诉</span>风险。建议在后续参数定义中重点关注【设备尺寸】与【运行噪音】。
        </div>
      </div>

      <ButtonSolid onClick={onConfirm} className="w-full bg-indigo-600 hover:bg-indigo-700 py-1.5 text-[11px]">确认预测，补充具体诉求</ButtonSolid>
    </div>
  </Card>
);

const BOMAnalysisCard = ({ onConfirm }: { onConfirm: () => void }) => (
  <Card className="mt-2 border-blue-100 shadow-sm">
    <div className="p-2 border-b border-blue-50 flex justify-between items-start bg-blue-50/50">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Layers size={12} /></div>
        <span className="font-semibold text-gray-800 text-xs">BOM清单智能解析与审查</span>
      </div>
    </div>
    <div className="p-2">
      <p className="text-[10px] text-gray-600 mb-2 leading-relaxed">
        依托物资本体结构（Ontology），已对您上传的《管网配套BOM清单》进行深度解析：共识别 <span className="font-bold text-blue-600">45</span> 项物资，已自动去重并按物资本体归类。
      </p>

      <div className="space-y-2 mb-3">
        <div className="bg-green-50 border border-green-100 rounded-lg p-2">
          <div className="flex items-center justify-between mb-0.5">
            <div className="text-[10px] font-semibold text-green-800 flex items-center gap-1">
              <CheckCircle size={10} /> 标准/简单件 (38项)
            </div>
            <span className="text-[8px] text-green-600 bg-green-100 px-1 py-0.5 rounded">自动补全，免打扰</span>
          </div>
          <div className="text-[9px] text-green-700 leading-relaxed">
            包含：无缝钢管、PE管、标准法兰、紧固件等。<br/>
            <span className="opacity-80">系统已自动匹配 GB/T 国家标准及历史采购优选品牌。</span>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-lg p-2">
          <div className="text-[10px] font-semibold text-orange-800 mb-0.5 flex items-center gap-1">
            <AlertTriangle size={10} /> 本体关联规则审查 (发现 1 处冲突)
          </div>
          <div className="text-[9px] text-orange-800 leading-relaxed">
            <span className="font-bold">压力等级不匹配：</span>清单中第12项【平焊法兰(PN1.6)】与第15项【燃气紧急切断阀(PN2.5)】压力等级冲突。<br/>
            <span className="font-semibold text-orange-600">💡 专家建议：</span>已为您将法兰自动升档为 PN2.5 以匹配阀门。
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2">
          <div className="flex items-center justify-between mb-0.5">
            <div className="text-[10px] font-semibold text-indigo-800 flex items-center gap-1">
              <Target size={10} /> 关键/风险件 (7项)
            </div>
            <span className="text-[8px] text-indigo-600 bg-indigo-100 px-1 py-0.5 rounded">需深度定义</span>
          </div>
          <div className="text-[9px] text-indigo-700 leading-relaxed">
            包含：<span className="font-bold">燃气调压箱(10台)</span>、智能流量计(2台)、加臭机(1台)等。<br/>
            <span className="opacity-80">此类物资受工况影响大，存在较高采购风险，需进一步明确参数。</span>
          </div>
        </div>
      </div>

      <div className="text-[9px] text-gray-500 mb-2 text-center">
        ✨ 已为您减少 84% 的重复确认工作，请仅对核心风险件进行决策。
      </div>

      <ButtonSolid onClick={onConfirm} className="w-full bg-blue-600 hover:bg-blue-700 py-1.5 text-[11px]">
        一键修复冲突，进入【关键件】深度定义
      </ButtonSolid>
    </div>
  </Card>
);

const ChatPromptHouseholds = ({ onSelect }: { onSelect: (val: string) => void }) => {
  const [selected, setSelected] = useState(false);
  return (
    <div>
      <p className="text-sm mb-2">收到！为老旧小区改造采购10台燃气调压箱。作为您的采购大脑，我已调取《城镇燃气设计规范》。为了帮您精准推算设备参数，请问<strong>每个调压箱大约覆盖多少户居民</strong>？</p>
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
      <p className="text-sm mb-2">好的。基于物资本体逻辑，<strong>用气场景</strong>会直接影响峰值流量测算。请问这些居民是<strong>仅做饭</strong>，还是<strong>做饭+壁挂炉采暖</strong>？</p>
      {!selected && (
        <div className="flex gap-2 mt-2">
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("仅做饭"); }}>仅做饭</ButtonOutline>
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("做饭+采暖"); }}>做饭+采暖</ButtonOutline>
        </div>
      )}
    </div>
  );
};

const ChatPromptBusiness1 = ({ onSelect }: { onSelect: (val: string) => void }) => {
  const [selected, setSelected] = useState(false);
  return (
    <div>
      <p className="text-sm mb-2">了解。老旧小区改造通常空间有限，请问<strong>安装位置</strong>主要在哪里？</p>
      {!selected && (
        <div className="flex gap-2 mt-2">
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("绿化带/空地"); }}>绿化带/空地</ButtonOutline>
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("靠近居民楼外墙"); }}>靠近居民楼外墙</ButtonOutline>
        </div>
      )}
    </div>
  );
};

const ChatPromptBusiness2 = ({ onSelect }: { onSelect: (val: string) => void }) => {
  const [selected, setSelected] = useState(false);
  return (
    <div>
      <p className="text-sm mb-2">好的。考虑到您提到“最近冬天老降温，怕冻坏了影响供气”，请问该地区<strong>冬季最低气温</strong>大约是多少？</p>
      {!selected && (
        <div className="flex gap-2 mt-2">
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("0℃以上"); }}>0℃以上</ButtonOutline>
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("-10℃左右"); }}>-10℃左右</ButtonOutline>
          <ButtonOutline color="blue" onClick={() => { setSelected(true); onSelect("-20℃及以下"); }}>-20℃及以下</ButtonOutline>
        </div>
      )}
    </div>
  );
};

const Step1ConfirmCard = ({ households, usage, business1, business2, onConfirm }: { households: string, usage: string, business1: string, business2: string, onConfirm: () => void }) => {
  const [confirmed, setConfirmed] = useState(false);
  const flowRate = usage === "做饭+采暖" ? (households === "约500户" ? "≥ 2000 Nm³/h" : "≥ 1200 Nm³/h") : (households === "约500户" ? "≥ 1000 Nm³/h" : "≥ 600 Nm³/h");

  return (
    <Card className="mt-2">
      <div className="p-2.5 border-b border-gray-50 flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Cpu size={12} /></div>
        <span className="font-semibold text-gray-800 text-xs">初步的结构化说明书</span>
      </div>
      <div className="p-3 space-y-2 text-[10px]">
        <div className="flex justify-between items-center"><span className="text-gray-500">推算流量需求:</span><span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">{flowRate}</span></div>
        <div className="flex justify-between items-center"><span className="text-gray-500">默认进口压力:</span><span className="text-gray-800">0.2~0.4 MPa (中压A)</span></div>
        <div className="flex justify-between items-center"><span className="text-gray-500">默认出口压力:</span><span className="text-gray-800">2.0 kPa (低压)</span></div>
        <div className="space-y-3 mt-3">
          <div className="border-t border-gray-100 pt-2">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">基础物资属性规格参数</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="bg-white p-1 rounded border border-gray-100 text-[8px]"><span className="text-gray-500">材质:</span> Q235B碳钢</div>
              <div className="bg-white p-1 rounded border border-gray-100 text-[8px]"><span className="text-gray-500">防腐:</span> 环氧树脂</div>
              <div className="bg-white p-1 rounded border border-gray-100 text-[8px]"><span className="text-gray-500">接口:</span> DN100法兰</div>
              <div className="bg-white p-1 rounded border border-gray-100 text-[8px]"><span className="text-gray-500">防护:</span> IP65</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">特殊工况与配套要求</div>
            <div className="space-y-0.5 text-[8px] text-gray-600 bg-white p-1.5 rounded border border-gray-100">
              <p>• <span className="font-bold text-blue-700">极寒应对：</span>配套防爆电伴热，温控范围 5-15℃。</p>
              <p>• <span className="font-bold text-blue-700">降噪配套：</span>调压箱内壁粘贴 20mm 隔音棉。</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">初步 TCO 与交付评</div>
            <div className="grid grid-cols-2 gap-1 text-[8px]">
              <div className="bg-blue-50 p-1 rounded border border-blue-100">
                <div className="text-blue-700 font-bold">LCC 成本预估</div>
                <div className="text-blue-900">运维成本降低 15%</div>
              </div>
              <div className="bg-green-50 p-1 rounded border border-green-100">
                <div className="text-green-700 font-bold">交付周期</div>
                <div className="text-green-900">预计 14-21 天</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">物资质量判别方案</div>
            <div className="text-[8px] text-gray-600 bg-white p-1.5 rounded border border-gray-100 leading-tight">
              采用“本体特征+机理仿真”双重校验。重点核查密封性（0.6MPa 稳压 1h）与 NB-IoT 信号强度（&gt;-90dBm）。
            </div>
          </div>
        </div>

        {!confirmed && (
          <ButtonSolid className="w-full mt-2" onClick={() => { setConfirmed(true); onConfirm(); }}>确认初步需求说明，进行需求仿真</ButtonSolid>
        )}
      </div>
    </Card>
  );
};



export interface ConfigState {
  days: number;
  material: number;
  insulation: 'basic' | 'advanced';
  telemetry: 'basic' | 'full';
  noiseReduction: boolean;
}

const ValveComponent = ({ config }: { config: ConfigState }) => {
  const materialProps = config.material > 50
    ? { color: '#e2e8f0', metalness: 0.8, roughness: 0.2 } // Stainless Steel
    : { color: '#475569', metalness: 0.4, roughness: 0.6 }; // Carbon Steel

  return (
    <group position={[0, -0.5, 0]}>
      {/* Cabinet Box */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.5, 2.5, 1.5]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} />
      </mesh>
      
      {/* Pipe Manifold */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 2.2, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Filter */}
      <mesh position={[-0.6, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.5, 32]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      
      {/* Regulator */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Pressure Gauge */}
      <mesh position={[0, 0.5, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Silencer / Noise Reduction Module */}
      {config.noiseReduction && (
        <group position={[0.8, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.5, 32]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      )}

      {/* Telemetry Box */}
      {config.telemetry === 'full' && (
        <group position={[0.6, 0.4, 0.4]}>
          <mesh>
            <boxGeometry args={[0.3, 0.4, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>
      )}
    </group>
  );
};

const BOMModel = ({ type, config }: { type: string | null, config: ConfigState }) => {
  const materialProps = config.material > 50
    ? { color: '#e2e8f0', metalness: 0.8, roughness: 0.2 } // Stainless Steel
    : { color: '#475569', metalness: 0.4, roughness: 0.6 }; // Carbon Steel

  if (type === '智能流量计') {
    return (
      <group position={[0, -0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 3, 32]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.6, 0.4, 0.6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.6, 0.2]}>
          <boxGeometry args={[0.4, 0.2, 0.05]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
      </group>
    );
  }

  if (type === '加臭机') {
    return (
      <group position={[0, -0.5, 0]}>
        <mesh>
          <boxGeometry args={[1.2, 1.8, 0.8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0, 0.41]}>
          <boxGeometry args={[0.8, 1.2, 0.05]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.3, 0.5, 0.45]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" />
        </mesh>
      </group>
    );
  }

  // Default to Valve/Regulator
  return <ValveComponent config={config} />;
};

const Step3Card = ({ onNext }: { onNext: (config: ConfigState) => void }) => {
  const [config, setConfig] = useState<ConfigState>({ days: 15, material: 100, insulation: 'advanced', telemetry: 'full', noiseReduction: true });
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
    setConfig({ days: c.days, material: c.material, insulation: c.insulation, telemetry: c.telemetry, noiseReduction: c.noiseReduction });
    setIsCalculating(true);
    setShowResult(false);
    setTimeout(() => { setIsCalculating(false); setShowResult(true); }, 500);
  };

  const initialCost = 12000 + (config.material > 50 ? 6000 : 0) + (config.insulation === 'advanced' ? 3500 : 0) + (config.telemetry === 'full' ? 2500 : 0) + (config.noiseReduction ? 1800 : 0);
  const maintCost = (1500 + (config.material > 50 ? 0 : 1800) + (config.insulation === 'advanced' ? 0 : 2500) + (config.telemetry === 'full' ? 0 : 1200)) * 5; // 5-year maintenance
  const timeCost = (30 - config.days) * 600 + (config.noiseReduction ? 0 : 5000); // Expedite risk/cost + noise complaint risk


  const maxCost = 35000; // For scaling heights
  const initialCostHeight = Math.max(10, (initialCost / maxCost) * 100);
  const maintenanceCostHeight = Math.max(10, (maintCost / maxCost) * 100);
  const timeCostHeight = Math.max(10, (timeCost / maxCost) * 100);

  return (
    <Card className="mt-2">
      <div className="p-4 border-b border-gray-50 flex justify-between items-start">
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Box size={14} /></div><span className="font-semibold text-gray-800 text-sm">仿真呈现和共识</span></div>
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
                <ValveComponent config={config} />
                <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
              </Suspense>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
          </div>
          
          {/* Overlays */}
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            {config.telemetry === 'full' && <div className="bg-blue-900/90 text-white text-[10px] px-2 py-1 rounded shadow-md flex items-center gap-1 backdrop-blur-sm"><Activity size={10}/> 5G全量远传终端</div>}
            {config.insulation === 'advanced' && <div className="bg-orange-500/90 text-white text-[10px] px-2 py-1 rounded shadow-md flex items-center gap-1 backdrop-blur-sm"><Zap size={10}/> 防爆电伴热 (模拟开启)</div>}
            {config.noiseReduction && <div className="bg-slate-700/90 text-white text-[10px] px-2 py-1 rounded shadow-md flex items-center gap-1 backdrop-blur-sm"><Activity size={10}/> 阻抗复合式消音器</div>}
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
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-slate-600" />
              <span className="text-xs font-semibold text-gray-700">降噪消音模块 (老旧小区推荐)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={config.noiseReduction} onChange={(e) => handleChange('noiseReduction', e.target.checked)} />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
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

const Step4Card = ({ config }: { config: ConfigState }) => (
  <Card className="mt-2">
    <div className="p-4 border-b border-gray-50 flex justify-between items-start">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><ClipboardList size={14} /></div>
        <span className="font-semibold text-gray-800 text-sm">最终的采购需求说明书</span>
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
          <div className="flex justify-between"><span className="text-gray-500">运行噪音限制:</span><span className="text-gray-800">{config.noiseReduction ? '≤45dB (增配消音器)' : '≤55dB (近居民区)'}</span></div>
        </div>
      </Accordion>

      <Accordion title="特种工况与配套要求" defaultOpen={false}>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">防冻保温等级:</span><span className="text-indigo-600 font-medium">{config.insulation === 'advanced' ? '智能防爆电伴热' : '标准保温棉'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">远传监控:</span><span className="text-indigo-600 font-medium">{config.telemetry === 'full' ? '5G全量数据远传' : '基础表计(人工抄表)'}</span></div>
          {config.noiseReduction && <div className="flex justify-between"><span className="text-gray-500">降噪模块:</span><span className="text-indigo-600 font-medium">阻抗复合式消音器</span></div>}
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
    </div>
  </Card>
);

const Step6Card = ({ config, onPreviewSOP }: { config: ConfigState, onPreviewSOP?: () => void }) => (
  <Card className="mt-2 border-blue-200 shadow-sm">
    <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex justify-between items-center">
      <div className="flex items-center gap-1.5"><Target size={12} /><span className="font-semibold text-[11px]">供应商能力需求清单</span></div>
    </div>
    <div className="p-2">
      <p className="text-[10px] text-gray-600 mb-2 leading-relaxed">基于规格说明书，需智已将物资需求转化为对供应商的<span className="font-semibold text-blue-600">【能力标尺】</span>，用以精准寻源。</p>
      
      <div className="space-y-1.5 mb-3">
        <div className="flex items-start gap-1.5 p-1.5 border border-gray-100 rounded bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors">
          <div className="w-5 h-5 rounded bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0"><Truck size={10} /></div>
          <div>
            <div className="text-[10px] font-semibold text-gray-800 mb-0.5">履约交付能力</div>
            <div className="text-[9px] text-gray-600 leading-relaxed">需要具备根据客户给出时效（<span className="font-bold text-blue-600">{config.days}天</span>）准时排产与到货的敏捷物流能力。</div>
          </div>
        </div>

        <div className="flex items-start gap-1.5 p-1.5 border border-gray-100 rounded bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors">
          <div className="w-5 h-5 rounded bg-white shadow-sm flex items-center justify-center text-orange-500 shrink-0"><Zap size={10} /></div>
          <div>
            <div className="text-[10px] font-semibold text-gray-800 mb-0.5">特种制造与防爆能力</div>
            <div className="text-[9px] text-gray-600 leading-relaxed">具备“防冷凝加热型调压箱”的定制组装与测试能力，确保稳态调压精度≤±10%，并能提供配套的防爆电源及防爆合格证。</div>
          </div>
        </div>

        <div className="flex items-start gap-1.5 p-1.5 border border-gray-100 rounded bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors">
          <div className="w-5 h-5 rounded bg-white shadow-sm flex items-center justify-center text-green-600 shrink-0"><Layers size={10} /></div>
          <div>
            <div className="text-[10px] font-semibold text-gray-800 mb-0.5">现场服务与数智运维能力</div>
            <div className="text-[9px] text-gray-600 leading-relaxed">具备特种保温防护安装服务能力，及智能压力监测终端的数据远传对接能力，确保设备运行噪音≤55dB。</div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full mb-2"></div>

      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <ShieldCheck size={10} className="text-green-500" />
          已同步生成《到货验收SOP》
        </div>
        <span onClick={onPreviewSOP} className="text-[9px] text-blue-500 cursor-pointer hover:underline">预览SOP</span>
      </div>

      <ButtonSolid className="bg-blue-600 hover:bg-blue-700 shadow-sm py-1.5 text-[11px]">
        一键发起全域寻源采购
      </ButtonSolid>
    </div>
  </Card>
);

export interface ScenarioState {
  noise: boolean;
  underground: boolean;
  power: boolean;
  cold: boolean;
}

const GlobalScenarioCard = ({ onConfirm }: { onConfirm: (scenarios: ScenarioState) => void }) => {
  const [scenarios, setScenarios] = useState<ScenarioState>({
    noise: true,
    underground: true,
    power: true,
    cold: false
  });

  const toggle = (key: keyof ScenarioState) => setScenarios(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <Card className="mt-2 border-indigo-100 shadow-sm">
      <div className="p-2 border-b border-indigo-50 bg-indigo-50/50 flex items-center gap-1.5">
        <Sliders size={12} className="text-indigo-600" />
        <span className="font-semibold text-gray-800 text-[11px]">全局工况特征提取</span>
      </div>
      <div className="p-2">
        <p className="text-[10px] text-gray-600 mb-2 leading-relaxed">
          为避免逐一询问，我已从“老旧小区改造”项目库中提取了以下全局环境约束。请核对，我将据此<strong>批量推演</strong>所有关键物资参数：
        </p>
        <div className="space-y-1 mb-2">
          <label className="flex items-start gap-1.5 p-1.5 rounded border border-gray-100 bg-gray-50 cursor-pointer hover:bg-indigo-50 transition-colors">
            <input type="checkbox" checked={scenarios.noise} onChange={() => toggle('noise')} className="mt-0.5 accent-indigo-600" />
            <div>
              <div className="text-[10px] font-semibold text-gray-800">靠近居民区 / 敏感设施</div>
              <div className="text-[9px] text-gray-500">影响：设备噪音限制、危化品防漏等级</div>
            </div>
          </label>
          <label className="flex items-start gap-1.5 p-1.5 rounded border border-gray-100 bg-gray-50 cursor-pointer hover:bg-indigo-50 transition-colors">
            <input type="checkbox" checked={scenarios.underground} onChange={() => toggle('underground')} className="mt-0.5 accent-indigo-600" />
            <div>
              <div className="text-[10px] font-semibold text-gray-800">地下阀井 / 易积水环境</div>
              <div className="text-[9px] text-gray-500">影响：设备防护等级(IP)、信号穿透能力</div>
            </div>
          </label>
          <label className="flex items-start gap-1.5 p-1.5 rounded border border-gray-100 bg-gray-50 cursor-pointer hover:bg-indigo-50 transition-colors">
            <input type="checkbox" checked={scenarios.power} onChange={() => toggle('power')} className="mt-0.5 accent-indigo-600" />
            <div>
              <div className="text-[10px] font-semibold text-gray-800">无市电接入条件</div>
              <div className="text-[9px] text-gray-500">影响：供电方式、通讯模块功耗</div>
            </div>
          </label>
          <label className="flex items-start gap-1.5 p-1.5 rounded border border-gray-100 bg-gray-50 cursor-pointer hover:bg-indigo-50 transition-colors">
            <input type="checkbox" checked={scenarios.cold} onChange={() => toggle('cold')} className="mt-0.5 accent-indigo-600" />
            <div>
              <div className="text-[10px] font-semibold text-gray-800">冬季极寒工况 (可选)</div>
              <div className="text-[9px] text-gray-500">影响：防冻保温配置、材质耐低温要求</div>
            </div>
          </label>
        </div>
        <ButtonSolid onClick={() => onConfirm(scenarios)} className="w-full bg-indigo-600 hover:bg-indigo-700 py-1.5 text-[11px]">确认工况</ButtonSolid>
      </div>
    </Card>
  );
};

const ReviewItemCard = ({
  title,
  badge,
  coreParams,
  scenarios,
  reasoning,
  details,
  onAdjust,
  isAdjusted
}: {
  title: string,
  badge: string,
  coreParams: string[],
  scenarios: ScenarioState,
  reasoning: React.ReactNode,
  details: React.ReactNode,
  onAdjust: () => void,
  isAdjusted?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);

  return (
    <div className={`border ${isAdjusted ? 'border-green-300 bg-green-50/20' : 'border-gray-100 bg-white'} rounded-lg overflow-hidden shadow-sm`}>
      <div className={`p-1.5 cursor-pointer ${isAdjusted ? 'hover:bg-green-50/40' : 'hover:bg-gray-50'} transition-colors`} onClick={() => setIsOpen(!isOpen)}>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-gray-800 flex items-center gap-1">
              {isAdjusted ? <CheckCircle size={10} className="text-green-600" /> : null}
              {title}
              {isAdjusted && <span className="text-[8px] text-green-600 font-normal ml-0.5">(已更新)</span>}
            </span>
            <span className="text-[8px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded">{badge}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={(e) => { e.stopPropagation(); onAdjust(); }} className="text-[9px] text-blue-500 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-1 py-0.5 rounded transition-colors">
              <Sliders size={9} /> 调整
            </button>
            {isOpen ? <ChevronUp size={12} className="text-gray-400" /> : <ChevronDown size={12} className="text-gray-400" />}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {coreParams.map((p, i) => <span key={i} className={`text-[8px] px-1 py-0.5 rounded border shadow-sm ${isAdjusted && p === '无保温' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-white text-gray-600 border-gray-100'}`}>{p}</span>)}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-50">
            <div className="p-1.5 space-y-1.5 bg-slate-50">
              <div>
                <div className="text-[9px] font-semibold text-gray-700 mb-0.5 flex items-center gap-1"><ClipboardList size={9} /> 详细规格参数</div>
                <div className="bg-white p-1 rounded border border-gray-100 text-[8px] text-gray-600 space-y-0.5 shadow-sm">
                  {details}
                </div>
              </div>
              {reasoning && (
                <div>
                  <div 
                    className="text-[9px] font-semibold text-indigo-700 mb-0.5 flex items-center gap-1 cursor-pointer hover:text-indigo-800 transition-colors"
                    onClick={() => setIsReasoningOpen(!isReasoningOpen)}
                  >
                    <Lightbulb size={9} /> 专家推演逻辑
                    {isReasoningOpen ? <ChevronUp size={9} className="ml-0.5" /> : <ChevronDown size={9} className="ml-0.5" />}
                  </div>
                  <AnimatePresence>
                    {isReasoningOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="space-y-0.5 pt-0.5">
                          {reasoning}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UnifiedReviewDashboard = ({ scenarios, onConfirm }: { scenarios: ScenarioState, onConfirm: () => void }) => {
  const [isCalculating, setIsCalculating] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsCalculating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isCalculating) {
    return (
      <Card className="mt-2 p-2 flex flex-col items-center justify-center gap-1 border-blue-100">
        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-[9px] font-medium text-blue-600">本体引擎正在将全局工况散射至 3 项关键物资...</div>
        <div className="text-[8px] text-gray-400">正在进行机理推演与风险规避</div>
      </Card>
    );
  }

  const items = [
    {
      name: '燃气调压箱',
      qty: '10 台',
      specs: ['DN100', '2.0kPa出口', '碳钢防腐', scenarios.noise ? '低噪音版' : '', scenarios.cold ? '防冻加热' : ''].filter(Boolean),
      supplement: '基于“老旧小区”及全局工况，系统已自动匹配市政中压管网降压至居民低压的标准压力参数。同时，考虑到夜间用气低谷，建议要求调压箱具备良好的小流量稳压特性；极寒工况下，全量关键件配套防爆电伴热系统。',
      evaluation: '建议重点评估。调压箱是核心安全设备，老旧小区空间受限且可能存在极寒天气，防冻和稳压性能直接关系到供气安全与居民体验。'
    },
    {
      name: '智能流量计',
      qty: '2 台',
      specs: ['超声波原理', '1:160量程比', scenarios.underground ? 'IP68' : 'IP65', scenarios.power ? '电池+NB-IoT' : '市电+4G'].filter(Boolean),
      supplement: '考虑到地下阀井或易积水环境，防护等级已提升至IP68。无市电接入条件下，采用低功耗电池与NB-IoT远传方案，确保数据稳定回传。',
      evaluation: '建议常规评估。主要关注电池寿命（需>5年）及NB-IoT信号在地下环境的穿透能力，避免后期频繁下井维护。'
    },
    {
      name: '加臭机',
      qty: '1 台',
      specs: ['全自动闭环', '±1%精度', scenarios.noise ? '双泵冗余' : '单泵标准'].filter(Boolean),
      supplement: '靠近居民区对气味泄漏零容忍，已配置双探头浓度检测及全自动闭环控制。若对噪音敏感，建议采用双泵冗余及隔音罩设计。',
      evaluation: '建议重点评估。危化品注入设备在居民区附近极其敏感，任何微小泄漏或异味都会引发居民投诉，需确保设备的绝对密封与高精度加注。'
    }
  ];

  const globalSections = [
    {
      title: '标准件清单 (自动匹配)',
      icon: <Box size={8} />,
      content: (
        <div className="grid grid-cols-2 gap-1">
          {['法兰/螺栓 (SS304)', '密封垫片 (石墨)', '压力表 (0-1.6MPa)', '放散管 (DN25)'].map((item, i) => (
            <div key={i} className="flex items-center gap-1 text-[7px] text-gray-600 bg-white px-1 py-0.5 rounded border border-gray-100">
              <CheckCircle size={6} className="text-green-500" /> {item}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '特殊工况与配套要求',
      icon: <Wind size={8} />,
      content: (
        <div className="space-y-0.5 text-[7px] text-gray-600">
          <p>• <span className="font-bold text-blue-700">极寒应对：</span>全量关键件配套防爆电伴热，温控范围 5-15℃。</p>
          <p>• <span className="font-bold text-blue-700">降噪配套：</span>调压箱内壁粘贴 20mm 隔音棉，出口加装消音器。</p>
        </div>
      )
    },
    {
      title: '初步 TCO 与交付评估',
      icon: <TrendingUp size={8} />,
      content: (
        <div className="grid grid-cols-2 gap-1 text-[7px]">
          <div className="bg-blue-50 p-1 rounded border border-blue-100">
            <div className="text-blue-700 font-bold">LCC 成本预估</div>
            <div className="text-blue-900">运维成本降低 15%</div>
          </div>
          <div className="bg-green-50 p-1 rounded border border-green-100">
            <div className="text-green-700 font-bold">交付周期</div>
            <div className="text-green-900">预计 14-21 天</div>
          </div>
        </div>
      )
    },
    {
      title: '物资质量判别方案',
      icon: <ShieldCheck size={8} />,
      content: (
        <div className="text-[7px] text-gray-600 leading-tight">
          采用“本体特征+机理仿真”双重校验。重点核查密封性（0.6MPa 稳压 1h）与 NB-IoT 信号强度（&gt;-90dBm）。
        </div>
      )
    }
  ];

  return (
    <Card className="mt-1.5">
      <div className="p-1 border-b border-gray-50 flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Cpu size={7} /></div>
        <span className="font-semibold text-gray-800 text-[9px]">初步的结构化说明书 (BOM全量)</span>
      </div>
      <div className="p-1 space-y-1">
        {/* Key Items Tabs */}
        <div className="space-y-1">
          <div className="text-[7px] font-bold text-gray-400 uppercase tracking-wider px-0.5">关键物资深度定义</div>
          <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 py-0.5 text-[7px] font-medium rounded transition-colors ${activeTab === idx ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-50 rounded p-1 border border-gray-100 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-semibold text-[9px]">{items[activeTab].name}</span>
              <span className="text-gray-500 text-[7px] font-medium bg-gray-200 px-1 py-0.5 rounded">x{items[activeTab].qty}</span>
            </div>
            
            <div>
              <div className="text-[6px] text-gray-400 mb-0.5 uppercase tracking-wider">初步技术参数要求</div>
              <div className="flex flex-wrap gap-0.5">
                {items[activeTab].specs.map((spec, i) => (
                  <span key={i} className="bg-white border border-gray-200 text-gray-600 px-1 py-0.5 rounded text-[7px]">{spec}</span>
                ))}
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded p-1">
              <div className="text-[7px] font-semibold text-blue-700 mb-0.5 flex items-center gap-0.5"><Lightbulb size={6} /> 专家逻辑补全</div>
              <div className="text-[7px] text-blue-900 leading-relaxed">{items[activeTab].supplement}</div>
            </div>

            <div className="bg-orange-50/50 border border-orange-100 rounded p-1">
              <div className="text-[7px] font-semibold text-orange-700 mb-0.5 flex items-center gap-0.5"><ShieldCheck size={6} /> 智能评估建议</div>
              <div className="text-[7px] text-orange-900 leading-relaxed">{items[activeTab].evaluation}</div>
            </div>
          </div>
        </div>

        {/* Global Sections */}
        <div className="space-y-1 pt-1 border-t border-gray-100">
          <div className="text-[7px] font-bold text-gray-400 uppercase tracking-wider px-0.5">全局配套与评估</div>
          <div className="grid grid-cols-1 gap-1">
            {globalSections.map((section, idx) => (
              <div key={idx} className="bg-white rounded border border-gray-100 p-1 space-y-0.5 shadow-sm">
                <div className="flex items-center gap-1 text-[8px] font-bold text-gray-700">
                  <span className="text-blue-500">{section.icon}</span>
                  {section.title}
                </div>
                <div className="pl-3">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!confirmed && (
          <ButtonSolid className="w-full mt-1 py-1 text-[9px] font-bold" onClick={() => { setConfirmed(true); onConfirm(); }}>确认初步需求说明，进行需求仿真</ButtonSolid>
        )}
      </div>
    </Card>
  );
};

const SOPDetailView = ({ onClose }: { onClose: () => void }) => {
  const steps = [
    { 
      title: '外观与铭牌核对', 
      desc: '核对铭牌参数（压力、流量、防爆等级）是否与需求说明书一致。检查漆膜是否有划伤，确认无运输磕碰。', 
      icon: <Search size={12} />,
      principle: '参数一致性是安全运行的前提。',
      exception: '铭牌模糊或参数不符需立即拒收。'
    },
    { 
      title: '关键尺寸测量', 
      desc: '使用数显卡尺测量法兰中心距、通径。偏差需控制在 ±1mm 以内，确保现场安装无应力。', 
      icon: <Sliders size={12} />,
      principle: '尺寸精度决定安装效率。',
      exception: '尺寸超差将导致管道强力对中，引发泄漏。'
    },
    { 
      title: '密封性现场测试', 
      desc: '接入 0.6MPa 气源，使用肥皂水涂抹连接处，观察 1 分钟内是否有气泡产生。', 
      icon: <Activity size={12} />,
      principle: '零泄漏是燃气设备的底线。',
      exception: '发现气泡需重新紧固或更换密封垫。'
    },
    { 
      title: '智能模块联调', 
      desc: '通电观察 LED 指示灯，确认 NB-IoT 信号强度 > -90dBm，数据上传成功至“需智”云端。', 
      icon: <Cpu size={12} />,
      principle: '数字化是降本增效的关键。',
      exception: '信号弱需调整天线位置或更换增强型天线。'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col"
    >
      <header className="p-1.5 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-1">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ChevronRight className="rotate-180" size={12} />
          </button>
          <h2 className="font-bold text-gray-800 text-[10px]">物资验收关键 SOP (专家级指导)</h2>
        </div>
        <div className="text-[7px] bg-blue-100 text-blue-600 px-1 py-0.5 rounded-full font-bold">标准版 v2.0</div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg text-white shadow-sm relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-10"><ShieldCheck size={50} /></div>
          <div className="relative z-10">
            <div className="text-[9px] font-bold mb-0.5 flex items-center gap-1">
              <ShieldCheck size={10} /> 验收核心原则
            </div>
            <p className="text-[8px] text-blue-100 leading-relaxed">
              本 SOP 旨在帮助非专业人员通过“看、量、试、调”四步法快速完成专业级验收。确保每一项物资都符合《采购需求说明书》的极致标准。
            </p>
          </div>
        </div>

        <div className="space-y-3 px-1">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {idx < steps.length - 1 && (
                <div className="absolute left-2.5 top-6 bottom-[-16px] w-0.5 bg-blue-100"></div>
              )}
              <div className="flex gap-2">
                <div className="relative z-10">
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black shadow-sm">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-1 text-gray-900 font-black text-[10px]">
                    <span className="p-0.5 bg-white rounded shadow-sm text-blue-600">{step.icon}</span>
                    <span>{step.title}</span>
                  </div>
                  
                  <Card className="p-1.5 border-gray-100 shadow-sm space-y-1.5">
                    <p className="text-[8px] text-gray-600 leading-relaxed font-medium">{step.desc}</p>
                    
                    <div className="grid grid-cols-2 gap-1">
                      <div className="space-y-0.5">
                        <div className="aspect-video bg-green-50 rounded border border-green-100 flex items-center justify-center text-[7px] text-green-600 font-bold">
                          <CheckCircle size={8} className="mr-0.5" /> 标准示例图
                        </div>
                        <div className="text-[5px] text-green-500 text-center">✅ 合格状态参考</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="aspect-video bg-red-50 rounded border border-red-100 flex items-center justify-center text-[7px] text-red-600 font-bold">
                          <AlertTriangle size={8} className="mr-0.5" /> 常见错误图
                        </div>
                        <div className="text-[5px] text-red-500 text-center">❌ 典型缺陷预警</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 pt-1 border-t border-gray-50">
                      <div className="space-y-0.5">
                        <div className="text-[5px] font-bold text-gray-400 uppercase">核心机理</div>
                        <div className="text-[6px] text-gray-500 italic">{step.principle}</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[5px] font-bold text-orange-400 uppercase">异常处理</div>
                        <div className="text-[6px] text-orange-600 font-bold">{step.exception}</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-orange-50 p-2 rounded-lg border border-orange-100 flex gap-1.5 items-start">
          <div className="p-1 bg-white rounded-full text-orange-500 shadow-sm"><AlertTriangle size={12} /></div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold text-orange-800">质量异议发起机制</div>
            <p className="text-[8px] text-orange-700 leading-relaxed">
              若发现任何不符项，请点击下方“发起异议”并拍照。系统将基于《需智采购合同》自动匹配违约条款，并通知供应商在 24 小时内给出整改方案。
            </p>
          </div>
        </div>
      </div>
      
      <footer className="p-2 bg-white border-t border-gray-100 flex gap-1.5">
        <button className="flex-1 py-1.5 rounded-md border border-orange-200 text-orange-600 text-[10px] font-bold hover:bg-orange-50 transition-colors">发起质量异议</button>
        <ButtonSolid onClick={onClose} className="flex-[2] py-1.5 text-[10px]">我已了解，返回评审</ButtonSolid>
      </footer>
    </motion.div>
  );
};

const BOMStep3Card = ({ onNext }: { onNext: (config: ConfigState) => void }) => {
  const [isCalculating, setIsCalculating] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<string | null>('燃气调压箱');
  const [config, setConfig] = useState<ConfigState>({
    days: 15,
    material: 40,
    insulation: 'advanced',
    telemetry: 'full',
    noiseReduction: true
  });
  const [savedConfigs, setSavedConfigs] = useState<(ConfigState & {id: string, name: string})[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCalculating(false);
      setShowResult(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleConfigChange = (key: keyof ConfigState, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setIsCalculating(true);
    setShowResult(false);
    setTimeout(() => {
      setIsCalculating(false);
      setShowResult(true);
    }, 800);
  };

  const handleSave = () => {
    const name = `配置_${new Date().toLocaleTimeString()}`;
    setSavedConfigs([...savedConfigs, { ...config, id: Date.now().toString(), name }]);
  };

  const initialCost = 28000 + (config.material > 50 ? 5000 : 0) + (config.insulation === 'advanced' ? 3500 : 0) + (config.telemetry === 'full' ? 4200 : 0);
  const maintCost = (1500 + (config.material > 50 ? 0 : 1800) + (config.insulation === 'advanced' ? 0 : 2500) + (config.telemetry === 'full' ? 0 : 1200)) * 5;
  const timeCost = (30 - config.days) * 600 + (config.noiseReduction ? 0 : 5000);

  const maxCost = 45000;
  const initialCostHeight = Math.max(10, (initialCost / maxCost) * 100);
  const maintenanceCostHeight = Math.max(10, (maintCost / maxCost) * 100);
  const timeCostHeight = Math.max(10, (timeCost / maxCost) * 100);

  return (
    <Card className="mt-2">
      <div className="p-1.5 border-b border-gray-50 flex justify-between items-start">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><Box size={8} /></div>
          <span className="font-semibold text-gray-800 text-[10px]">仿真呈现和共识 (BOM全量)</span>
        </div>
      </div>
      <div className="p-1.5">
        <div className="space-y-1 mb-1.5">
          <div className="text-[8px] font-semibold text-gray-700">核心物资仿真 (可选)</div>
          <div className="grid grid-cols-3 gap-0.5">
            {['燃气调压箱', '智能流量计', '加臭机'].map(item => (
              <div 
                key={item} 
                onClick={() => setActiveSimulation(activeSimulation === item ? null : item)}
                className={`p-0.5 rounded border text-[7px] text-center cursor-pointer transition-all ${activeSimulation === item ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-blue-300'}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeSimulation && (
            <motion.div key={activeSimulation} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-1.5">
              <div className="w-full h-24 bg-slate-900 rounded relative flex items-center justify-center border border-slate-800 overflow-hidden">
                <div className="absolute inset-0 z-10">
                  <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                    <Suspense fallback={null}>
                      <Environment preset="city" />
                      <BOMModel type={activeSimulation} config={config} />
                      <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
                    </Suspense>
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                  </Canvas>
                </div>
                <div className="absolute top-0.5 right-0.5 z-20 bg-black/50 text-white text-[6px] px-1 py-0.5 rounded backdrop-blur-sm border border-white/10">
                  {activeSimulation} 实时机理仿真
                </div>
              </div>

              {/* 参数调节面板 */}
              <div className="mt-1 p-1 bg-gray-50 rounded border border-gray-100 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-bold text-gray-700">参数个性化调节</span>
                  <button onClick={handleSave} className="text-[7px] text-blue-600 flex items-center gap-0.5 hover:underline">
                    <Bookmark size={6} /> 保存当前配置
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="space-y-0.5">
                    <label className="text-[7px] text-gray-500">保温等级</label>
                    <select 
                      value={config.insulation} 
                      onChange={(e) => handleConfigChange('insulation', e.target.value)}
                      className="w-full text-[7px] p-0.5 border rounded bg-white"
                    >
                      <option value="standard">标准保温</option>
                      <option value="advanced">极寒加强 (电伴热)</option>
                    </select>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[7px] text-gray-500">降噪模块</label>
                    <div className="flex items-center gap-0.5 h-4">
                      <input 
                        type="checkbox" 
                        checked={config.noiseReduction} 
                        onChange={(e) => handleConfigChange('noiseReduction', e.target.checked)}
                        className="w-2 h-2"
                      />
                      <span className="text-[7px]">阻抗式消音器</span>
                    </div>
                  </div>
                </div>
                {savedConfigs.length > 0 && (
                  <div className="pt-0.5 border-t border-gray-200">
                    <div className="text-[6px] text-gray-400 mb-0.5">已保存配置:</div>
                    <div className="flex flex-wrap gap-0.5">
                      {savedConfigs.map(sc => (
                        <div key={sc.id} onClick={() => setConfig(sc)} className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[6px] cursor-pointer hover:border-blue-400">
                          {sc.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-blue-50 border border-blue-100 rounded p-1.5 mb-1.5">
          <div className="text-[8px] font-semibold text-blue-800 mb-0.5 flex items-center gap-0.5"><Lightbulb size={6} /> 全量物资机理共识</div>
          <div className="space-y-0.5">
            <div className="flex items-start gap-0.5 text-[7px] text-blue-700">
              <div className="w-1 h-1 rounded-full bg-blue-400 mt-0.5 shrink-0"></div>
              <p><strong>压力匹配共识：</strong>已验证法兰 PN2.5 与调压箱进口压力 0.4MPa 的机理兼容性，规避密封失效风险。</p>
            </div>
            <div className="flex items-start gap-0.5 text-[7px] text-blue-700">
              <div className="w-1 h-1 rounded-full bg-blue-400 mt-0.5 shrink-0"></div>
              <p><strong>环境适应共识：</strong>针对极寒工况，全量关键件已同步“防爆电伴热”逻辑，确保零下20度运行稳定。</p>
            </div>
          </div>
        </div>

        <div className="h-16 mb-1.5">
          <AnimatePresence mode="wait">
            {isCalculating && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center gap-0.5 text-blue-500">
                <div className="w-2 h-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[8px] font-medium">BOM 全量 TCO 算账中...</span>
              </motion.div>
            )}
            {showResult && !isCalculating && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col gap-0.5">
                <div className="flex-1 border border-gray-100 rounded bg-white p-1 flex flex-col">
                  <div className="text-[7px] text-gray-500 mb-0.5 font-semibold">BOM 全生命周期成本 (TCO) 预测</div>
                  <div className="flex-1 flex items-end gap-0.5 pt-0.5 h-10">
                    <div className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                      <span className="text-[6px] text-blue-600 font-bold mb-0.5">¥{(initialCost/10000).toFixed(1)}万</span>
                      <div className="w-full bg-blue-400 rounded-t" style={{ height: `${initialCostHeight}%` }}></div>
                      <span className="text-[5px] text-gray-400">初期采购</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                      <span className="text-[6px] text-indigo-600 font-bold mb-0.5">¥{(maintCost/10000).toFixed(1)}万</span>
                      <div className="w-full bg-indigo-400 rounded-t" style={{ height: `${maintenanceCostHeight}%` }}></div>
                      <span className="text-[5px] text-gray-400">5年维保</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                      <span className="text-[6px] text-teal-600 font-bold mb-0.5">¥{(timeCost/10000).toFixed(1)}万</span>
                      <div className="w-full bg-teal-400 rounded-t" style={{ height: `${timeCostHeight}%` }}></div>
                      <span className="text-[5px] text-gray-400">风险/损失</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ButtonSolid onClick={() => onNext(config)} disabled={isCalculating || !showResult} className="w-full py-1 text-[10px]">逻辑无误，确认全量共识</ButtonSolid>
      </div>
    </Card>
  );
};

const BOMStep4Card = ({ scenarios, onConfirm, onPreviewSOP }: { scenarios: ScenarioState, onConfirm: () => void, onPreviewSOP: () => void }) => {
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);

  const items = [
    {
      name: '燃气调压箱',
      type: '核心调压',
      specs: ['DN100', '2.0kPa出口', 'Q235B碳钢', scenarios.noise ? '双级消音' : '单级标准', scenarios.cold ? '电伴热+保温棉' : '标准防腐'],
      tech: '具备超压切断、低压切断、安全放散三位一体保护。切断精度 ≤ ±5%。'
    },
    {
      name: '智能流量计',
      type: '计量远传',
      specs: ['超声波', 'G65', scenarios.underground ? 'IP68全密封' : 'IP65', scenarios.power ? '双电源冗余' : '锂电供电'],
      tech: '支持温度、压力补偿，具备反向流检测与非法拆卸报警功能。'
    },
    {
      name: '加臭机',
      type: '安全注入',
      specs: ['柱塞泵', '0.01-10L/h', '316L不锈钢', scenarios.noise ? '隔音罩' : '标准'],
      tech: '全自动比例加注，支持 4-20mA 流量跟踪，具备药剂低液位报警。'
    }
  ];

  const GlobalMaterialRequirementDeduction = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2 flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-900">
            <ShieldCheck size={10} className="text-gray-500" /> 物资配套需求推演
          </div>
          {isOpen ? <ChevronUp size={10} className="text-gray-400" /> : <ChevronDown size={10} className="text-gray-400" />}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0 }} 
              animate={{ height: 'auto' }} 
              exit={{ height: 0 }} 
              className="overflow-hidden border-t border-gray-100 bg-gray-50/50"
            >
              <div className="p-1.5 space-y-1">
                <Card className="border-gray-200 shadow-sm p-1.5">
                  <div className="text-[8px] font-bold text-gray-600 uppercase tracking-wider mb-0.5">特殊工况与配套要求</div>
                  <p className="text-[9px] text-gray-800 leading-relaxed">针对老旧小区狭窄空间，调压箱采用侧开门设计；极寒工况下，全量关键件配套防爆电伴热系统。</p>
                </Card>
                <Card className="border-gray-200 shadow-sm p-1.5">
                  <div className="text-[8px] font-bold text-gray-600 uppercase tracking-wider mb-0.5">物资质量判别方案</div>
                  <p className="text-[9px] text-gray-800 leading-relaxed">全量物资需通过 1.5 倍压力强度试验，提供探伤报告与型式批准证书。</p>
                </Card>
                <Card className="border-gray-200 shadow-sm p-1.5">
                  <div className="text-[8px] font-bold text-gray-600 uppercase tracking-wider mb-0.5">最优需求 (质量/价格/交付)</div>
                  <p className="text-[9px] text-gray-800 leading-relaxed">质量等级 A，价格控制在预算内，10-20 天内分批交付。</p>
                </Card>
                <Card className="border-gray-200 shadow-sm p-1.5">
                  <div className="text-[8px] font-bold text-gray-600 uppercase tracking-wider mb-0.5">风险点与控制方案</div>
                  <p className="text-[9px] text-gray-800 leading-relaxed">已建立 A/B 供应商双备份机制，要求供应商在本地仓库维持 30 天安全库存。</p>
                </Card>
                <Card className="border-gray-200 shadow-sm p-1.5">
                  <div className="text-[8px] font-bold text-gray-600 uppercase tracking-wider mb-0.5">可选替代方案</div>
                  <p className="text-[9px] text-gray-800 leading-relaxed">可选用国产高性能调压器或机械式流量计加装远传模块作为备选。</p>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Card className="mt-2 border-indigo-200 shadow-sm overflow-visible bg-indigo-50/30">
      <div className="p-1.5 space-y-1.5">
        <div className="text-[9px] text-indigo-600 font-bold flex items-center gap-1 px-1">
          <Box size={10} /> 关键物资全量规格定义：
        </div>

        {/* 物资切换标签页 */}
        <div className="flex gap-0.5 bg-indigo-200/30 p-0.5 rounded-lg overflow-x-auto no-scrollbar">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedItemIdx(idx)}
              className={`px-1 py-0.5 rounded-md text-[8px] font-bold whitespace-nowrap transition-all flex-1 ${selectedItemIdx === idx ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-600 hover:bg-indigo-100'}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedItemIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-indigo-100 shadow-sm overflow-hidden">
              <div className="p-1.5 bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black text-indigo-900">{items[selectedItemIdx].name}</span>
                  <span className="px-1 py-0.5 bg-indigo-600 text-white rounded text-[6px] font-bold uppercase tracking-tighter">{items[selectedItemIdx].type}</span>
                </div>
                <button onClick={onPreviewSOP} className="text-[8px] text-indigo-600 font-bold hover:underline flex items-center gap-1">
                  <Eye size={8} /> 预览验收SOP
                </button>
              </div>
              <div className="p-1.5 space-y-1.5">
                <div className="flex flex-wrap gap-0.5">
                  {items[selectedItemIdx].specs.map((s, i) => (
                    <span key={i} className="px-1 py-0.5 bg-white border border-indigo-100 rounded text-[7px] text-indigo-700 font-medium shadow-sm">{s}</span>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-1">
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                    <div className="flex items-center gap-1 text-indigo-900 font-bold text-[8px]">
                      <Zap size={8} className="text-amber-500" /> 核心技术要求
                    </div>
                    <p className="text-[8px] text-slate-600 leading-relaxed">{items[selectedItemIdx].tech}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <StandardItemsList />

        {/* 全局部分 */}
        <GlobalMaterialRequirementDeduction />

        <ButtonSolid onClick={onConfirm} className="w-full mt-1 bg-indigo-600 hover:bg-indigo-700 shadow-sm py-1 text-[10px] font-bold tracking-wide">
          共识并确认采购需求
        </ButtonSolid>
      </div>
    </Card>
  );
};



const AdjustPrompt = ({ item, onSubmit }: { item: string, onSubmit: (val: string) => void }) => {
  const [val, setVal] = useState('');
  return (
    <Card className="mt-1 border-blue-100 shadow-sm">
      <div className="p-1 bg-blue-50 border-b border-blue-100 text-[9px] font-medium text-blue-800 flex items-center gap-1">
        <Sliders size={8} /> 调整【{item}】参数
      </div>
      <div className="p-1.5">
        <p className="text-[8px] text-gray-600 mb-1">请描述您的调整需求，例如：“去掉防冻加热”、“改成涡轮式”等。</p>
        <textarea 
          className="w-full text-[9px] p-1 border border-gray-200 rounded focus:outline-none focus:border-blue-400 mb-1 resize-none" 
          rows={2} 
          placeholder="输入调整诉求..."
          value={val}
          onChange={e => setVal(e.target.value)}
        />
        <ButtonSolid onClick={() => { if(val.trim()) onSubmit(val); }} className="w-full bg-blue-600 hover:bg-blue-700 py-1 text-[9px]">提交调整</ButtonSolid>
      </div>
    </Card>
  );
};

const StandardItemsList = () => {
  const [showStandardItems, setShowStandardItems] = useState(false);
  return (
    <div className="border-t border-gray-200 pt-1.5">
      <button 
        onClick={() => setShowStandardItems(!showStandardItems)}
        className="w-full p-1.5 bg-white rounded-lg border border-gray-100 flex justify-between items-center hover:shadow-sm transition-all"
      >
        <div className="flex items-center gap-1">
          <ClipboardList size={10} className="text-gray-400" />
          <span className="text-[9px] font-medium text-gray-600">标准/简单件清单 (38项)</span>
        </div>
        {showStandardItems ? <ChevronUp size={10} className="text-gray-400" /> : <ChevronDown size={10} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {showStandardItems && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
             <div className="p-1 text-[7px] text-gray-500 grid grid-cols-2 gap-1">
              <div className="bg-white p-1 rounded border border-gray-50 flex justify-between"><span>无缝钢管</span><span className="text-blue-500">详情</span></div>
              <div className="bg-white p-1 rounded border border-gray-50 flex justify-between"><span>PE燃气管</span><span className="text-blue-500">详情</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSOP, setShowSOP] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const addMessage = (type: MessageType, content: React.ReactNode) => setMessages(prev => [...prev, { id: Date.now().toString(), type, content }]);
  const simulateAI = (content: React.ReactNode, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => { setIsTyping(false); addMessage('ai', content); }, delay);
  };

  const continueJourneyFromHouseholds = (onFinish?: () => void) => {
    simulateAI(<ChatPromptHouseholds onSelect={(households) => {
      addMessage('user', households);
      simulateAI(<ChatPromptUsage onSelect={(usage) => {
        addMessage('user', usage);
        simulateAI(<ChatPromptBusiness1 onSelect={(business1) => {
          addMessage('user', business1);
          simulateAI(<ChatPromptBusiness2 onSelect={(business2) => {
            addMessage('user', business2);
            simulateAI(<div><div className="mb-2 text-xs font-bold text-blue-600">【阶段 2：初步的结构化说明书】</div><p className="text-sm mb-2">明白。基于您的业务场景，系统已为您推算出核心技术参数。</p><Step1ConfirmCard households={households} usage={usage} business1={business1} business2={business2} onConfirm={() => {
              addMessage('user', "确认初步需求说明，进行需求仿真");
              simulateAI(<div><div className="mb-2 text-xs font-bold text-blue-600">【阶段 3：仿真呈现和共识】</div><p className="text-sm mb-2">参数已锁定！正在为您进行物资机理能力测算与风险规避...</p><Step3Card onNext={(config) => {
                addMessage('user', "确认最终方案");
                simulateAI(<div><div className="mb-2 text-xs font-bold text-blue-600">【阶段 4：最终的采购需求说明书】</div><p className="text-sm mb-2">方案已锁定，正在为您生成最终的《采购需求说明书》...</p><Step4Card config={config} />
                  <div className="mt-6 mb-2 text-xs font-bold text-blue-600">【阶段 5：供应商能力标尺】</div>
                  <p className="text-sm mt-4 mb-2">需求已确认并归档！您可以随时导出《采购需求说明书》进行后续采购流程。基于您的需求，已生成供应商能力标尺。</p><Step6Card config={config} onPreviewSOP={() => setShowSOP(true)} />
                  {onFinish && <ButtonSolid onClick={onFinish} className="mt-4 w-full">完成单项解析</ButtonSolid>}
                </div>);
              }} /></div>);
            }} /></div>);
          }} />);
        }} />);
      }} />);
    }} />);
  };

  const startJourney = () => {
    simulateAI(<div><div className="mb-2 text-xs font-bold text-blue-600">【阶段 1：初步技术参数确认】</div><p className="text-sm mb-2">您好！我是需智。我察觉到您的项目进度有了新动向。</p><PreJourneyCard onConfirm={() => {
      addMessage('user', "是的，我要买10个燃气调压箱，居民小区改造用，最近冬天老降温，怕冻坏了影响供气，要尽快到货。");
      continueJourneyFromHouseholds();
    }} /></div>);
  };

  const startBOMJourney = () => {
    addMessage('user', (
      <div className="flex items-center gap-2">
        <FileText size={16} />
        <span className="underline">老旧小区改造二期管网配套BOM清单.xlsx</span>
      </div>
    ));
    simulateAI(
      <div>
        <p className="text-sm mb-2">收到清单。正在依托物资本体结构（Ontology）进行预处理与关联分析...</p>
        <BOMAnalysisCard onConfirm={() => {
          addMessage('user', "一键修复冲突，进入【关键件】深度定义");
          simulateAI(
            <div>
              <p className="text-sm mb-2">冲突已修复！标准件已锁定。为了高效定义剩下的关键物资，我已从项目信息中提取了全局工况特征。请您核对：</p>
              <div className="mb-2 text-xs font-bold text-blue-600">【阶段 1：初步技术参数确认】</div>
              <GlobalScenarioCard onConfirm={(scenarios) => {
                addMessage('user', "确认工况");
                simulateAI(
                  <div>
                    <div className="mb-2 text-xs font-bold text-blue-600">【阶段 2：初步的结构化说明书】</div>
                    <UnifiedReviewDashboard scenarios={scenarios} onConfirm={() => {
                      addMessage('user', "确认初步需求说明，进行需求仿真");
                      simulateAI(
                        <div>
                          <div className="mb-2 text-xs font-bold text-blue-600">【阶段 3：仿真呈现和共识】</div>
                          <p className="text-sm mb-2">参数已锁定！正在为您进行全量物资机理能力测算与风险规避...</p>
                          <BOMStep3Card onNext={(config) => {
                            addMessage('user', "确认最终方案");
                            simulateAI(
                              <div>
                                <div className="mb-2 text-xs font-bold text-blue-600">【阶段 4：最终的采购需求说明书】</div>
                                <p className="text-sm mb-2">方案已锁定，正在为您生成最终的《BOM全量采购需求说明书》...</p>
                                <BOMStep4Card scenarios={scenarios} onPreviewSOP={() => setShowSOP(true)} onConfirm={() => {
                                  addMessage('user', "共识并确认采购需求");
                                  simulateAI(
                                    <div>
                                      <div className="mt-6 mb-2 text-xs font-bold text-blue-600">【阶段 5：供应商能力需求清单】</div>
                                      <p className="text-sm mb-2">需求已确认并归档！基于您的全量BOM需求，已生成供应商能力需求清单。</p>
                                      <Step6Card config={config} onPreviewSOP={() => setShowSOP(true)} />
                                    </div>
                                  );
                                }} />
                              </div>
                            );
                          }} />
                        </div>
                      );
                    }} />
                  </div>
                );
              }} />
            </div>
          );
        }} />
      </div>
    );
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
            <div className="flex flex-col gap-3 mt-6 w-full max-w-[250px]">
              <ButtonSolid onClick={startJourney} className="w-full">场景A：单物资深度解析</ButtonSolid>
              <ButtonOutline onClick={startBOMJourney} className="w-full justify-center py-2.5 text-sm font-medium border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100">场景B：多物资/BOM清单解析</ButtonOutline>
            </div>
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
      <AnimatePresence>
        {showSOP && <SOPDetailView onClose={() => setShowSOP(false)} />}
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
          <input type="text" placeholder="输入您的采购诉求..." className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" disabled />
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 opacity-50 cursor-not-allowed"><ChevronUp size={18} /></div>
        </div>
      </div>
    </div>
  );
}

