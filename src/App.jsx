import React, { useState, useEffect, useRef } from 'react'

const POOLS = [
  { id: 'noor', name: 'حوض النور', desc: 'للمشاريع الناشئة النورانية', apy: '12%', color: '#D4A017' },
  { id: 'siraj', name: 'حوض السراج', desc: 'تمويل السراج المنير', apy: '15%', color: '#E8B923' },
  { id: 'mizan', name: 'حوض الميزان', desc: 'عدالة التوزيع', apy: '10%', color: '#C99A14' },
  { id: 'rafid', name: 'حوض الرافد', desc: 'رافد الخير المستمر', apy: '18%', color: '#D4A017' },
  { id: 'hikma', name: 'حوض الحكمة', desc: 'استثمار الحكماء', apy: '22%', color: '#B88A12' },
  { id: 'baraka', name: 'حوض البركة', desc: 'بركة الرزق الحلال', apy: '8%', color: '#EAC54A' },
]

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('w_user') || 'null'))
  const [balance, setBalance] = useState(() => Number(localStorage.getItem('w_bal') || 1000))
  const [attestedToday, setAttestedToday] = useState(() => localStorage.getItem('w_attest') === new Date().toDateString())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAdmin, setShowAdmin] = useState(false)
  const [secretBuffer, setSecretBuffer] = useState('')
  const [poolsStake, setPoolsStake] = useState(() => JSON.parse(localStorage.getItem('w_pools') || '{}'))
  const [majlis, setMajlis] = useState(() => JSON.parse(localStorage.getItem('w_majlis') || '[]'))
  const [p2pOrders, setP2pOrders] = useState(() => JSON.parse(localStorage.getItem('w_p2p') || '[]'))
  const [diwan, setDiwan] = useState(() => JSON.parse(localStorage.getItem('w_diwan') || '[]'))
  const [souq, setSouq] = useState([
    { id: 1, title: 'مخطوطة اقتصادية نادرة', price: 250, seller: 'الحكيم', type: 'كتاب' },
    { id: 2, title: 'ختم شهادة موثق ذهبي', price: 500, seller: 'النقاش', type: 'أداة' },
    { id: 3, title: 'سجادة مجلس فاخرة', price: 1200, seller: 'التاجر', type: 'مجلس' },
  ])
  const attestRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('w_bal', balance)
    localStorage.setItem('w_pools', JSON.stringify(poolsStake))
    localStorage.setItem('w_majlis', JSON.stringify(majlis))
    localStorage.setItem('w_p2p', JSON.stringify(p2pOrders))
    localStorage.setItem('w_diwan', JSON.stringify(diwan))
    if(user) localStorage.setItem('w_user', JSON.stringify(user))
  }, [balance, poolsStake, majlis, p2pOrders, diwan, user])

  useEffect(() => {
    const onKey = (e) => {
      const buf = (secretBuffer + e.key).slice(-10)
      setSecretBuffer(buf)
      if(buf.includes('///')) setShowAdmin(v=>!v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [secretBuffer])

  const handleAttest = () => {
    if(attestedToday) return
    const reward = 50 + Math.floor(Math.random()*50)
    setBalance(b=>b+reward)
    setAttestedToday(true)
    localStorage.setItem('w_attest', new Date().toDateString())
    setDiwan(d=>[{id:Date.now(), text:`شهد ${user?.name||'مجهول'} شهادة حق اليوم +${reward} دينار`, time:new Date().toLocaleTimeString('ar-EG')},...d])
  }

  const stakePool = (id, amount) => {
    if(balance < amount) return alert('رصيدك لا يكفي')
    setBalance(b=>b-amount)
    setPoolsStake(s=>({...s, [id]:(s[id]||0)+amount}))
  }

  const unstakePool = (id) => {
    const amt = poolsStake[id]||0
    if(!amt) return
    setBalance(b=>b+amt)
    setPoolsStake(s=>{const n={...s}; delete n[id]; return n})
  }

  if(!user){
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#111116] border border-[#D4A017]/30 rounded-[24px] p-8 shadow-[0_0_60px_rgba(212,160,23,0.15)]">
          <h1 className="text-3xl font-bold text-[#D4A017] text-center mb-2">اقتصاد الشهود</h1>
          <p className="text-center text-[#f5e8c8]/60 mb-8">ادخل باسمك لتبدأ رحلة الشهادة</p>
          <input id="nameInp" placeholder="اسمك..." className="w-full bg-[#07070a] border border-[#D4A017]/20 rounded-xl p-4 text-[#f5e8c8] outline-none focus:border-[#D4A017] mb-4" />
          <button onClick={()=>{
            const v=document.getElementById('nameInp').value.trim()
            if(!v) return alert('اكتب اسمك')
            setUser({name:v, id:Date.now()})
          }} className="w-full bg-[#D4A017] text-black font-bold py-4 rounded-xl hover:bg-[#E8B923] transition">دخول المجلس</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-[#f5e8c8]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#07070a]/80 backdrop-blur-xl border-b border-[#D4A017]/20 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4A017] to-[#B88A12] flex items-center justify-center text-black font-bold">ش</div>
          <div>
            <div className="font-bold text-[#D4A017]">اقتصاد الشهود</div>
            <div className="text-xs text-white/50">{user.name}</div>
          </div>
        </div>
        <div className="bg-[#111116] border border-[#D4A017]/30 rounded-full px-4 py-1.5 text-[#D4A017] font-bold">{balance.toLocaleString()} دينار</div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4 p-4">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <div className="bg-[#111116] border border-[#D4A017]/20 rounded-2xl p-3 space-y-2 sticky top-[70px]">
            {[
              {k:'dashboard', t:'لوحة الشاهد'},
              {k:'attest', t:'الشهادة اليومية'},
              {k:'pools', t:'الأحواض الستة'},
              {k:'majlis', t:'المجلس'},
              {k:'p2p', t:'سوق P2P'},
              {k:'souq', t:'السوق'},
              {k:'diwan', t:'الديوان'},
            ].map(i=>(
              <button key={i.k} onClick={()=>setActiveTab(i.k)} className={`w-full text-right px-4 py-3 rounded-xl transition ${activeTab===i.k?'bg-[#D4A017] text-black font-bold':'hover:bg-white/5 text-[#f5e8c8]/80'}`}>{i.t}</button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9">
          {activeTab==='dashboard' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#111116] to-[#1a1a12] border border-[#D4A017]/30 rounded-[24px] p-6">
                <h2 className="text-2xl font-bold text-[#D4A017] mb-2">مرحباً يا {user.name}</h2>
                <p className="text-white/60">رصيدك الحالي يسمح لك بالشهادة والاستثمار في الأحواض. كل شهادة يومية تزيد بركة رزقك.</p>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-[#07070a] rounded-xl p-4 border border-white/10"><div className="text-white/50 text-xs">الرصيد</div><div className="text-[#D4A017] font-bold text-xl">{balance}</div></div>
                  <div className="bg-[#07070a] rounded-xl p-4 border border-white/10"><div className="text-white/50 text-xs">مستثمر</div><div className="text-[#D4A017] font-bold text-xl">{Object.values(poolsStake).reduce((a,b)=>a+b,0)}</div></div>
                  <div className="bg-[#07070a] rounded-xl p-4 border border-white/10"><div className="text-white/50 text-xs">شهادات</div><div className="text-[#D4A017] font-bold text-xl">{diwan.length}</div></div>
                </div>
              </div>
            </div>
          )}

          {activeTab==='attest' && (
            <div className="bg-[#111116] border border-[#D4A017]/30 rounded-[24px] p-8 text-center">
              <h2 className="text-3xl font-bold text-[#D4A017] mb-4">الشهادة اليومية</h2>
              <p className="text-white/60 mb-8">اشهد شهادة حق اليوم لتحصل على رزق من الحوض العام</p>
              <button ref={attestRef} disabled={attestedToday} onClick={handleAttest} className={`w-full max-w-sm mx-auto py-5 rounded-2xl font-bold text-xl transition ${attestedToday?'bg-white/10 text-white/30 cursor-not-allowed':'bg-[#D4A017] text-black hover:bg-[#E8B923] shadow-[0_0_30px_rgba(212,160,23,0.4)]'}`}>{attestedToday?'تمت الشهادة اليوم ✓':'أشهد شهادة حق'}</button>
              {attestedToday && <div className="mt-4 text-[#D4A017]/80">عد غداً لشهادة جديدة</div>}
            </div>
          )}

          {activeTab==='pools' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {POOLS.map(p=>(
                <div key={p.id} className="bg-[#111116] border border-[#D4A017]/20 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-[#D4A017] text-lg">{p.name}</h3>
                    <span className="bg-[#D4A017]/20 text-[#D4A017] px-3 py-1 rounded-full text-xs">{p.apy} عائد</span>
                  </div>
                  <p className="text-white/50 text-sm mb-4">{p.desc}</p>
                  <div className="text-xs text-white/40 mb-2">مستثمر فيه: {poolsStake[p.id]||0} دينار</div>
                  <div className="flex gap-2">
                    <button onClick={()=>stakePool(p.id, 100)} className="flex-1 bg-[#D4A017] text-black py-2.5 rounded-xl font-bold text-sm">استثمار 100</button>
                    <button onClick={()=>unstakePool(p.id)} className="flex-1 bg-white/10 py-2.5 rounded-xl text-sm">سحب</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab==='majlis' && (
            <div className="space-y-3">
              <div className="bg-[#111116] border border-[#D4A017]/20 rounded-2xl p-4 flex gap-2">
                <input id="majlisInp" placeholder="اطرح قضية للمجلس..." className="flex-1 bg-[#07070a] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#D4A017]/50" />
                <button onClick={()=>{
                  const v=document.getElementById('majlisInp').value.trim()
                  if(!v) return
                  setMajlis(m=>[{id:Date.now(), text:v, author:user.name, votes:0, time:new Date().toLocaleTimeString('ar-EG')},...m])
                  document.getElementById('majlisInp').value=''
                }} className="bg-[#D4A017] text-black px-6 rounded-xl font-bold">نشر</button>
              </div>
              {majlis.map(m=>(
                <div key={m.id} className="bg-[#111116] border border-white/10 rounded-2xl p-4">
                  <div className="text-white/90 mb-2">{m.text}</div>
                  <div className="flex justify-between text-xs text-white/40"><span>{m.author} • {m.time}</span><button onClick={()=>setMajlis(list=>list.map(x=>x.id===m.id?{...x, votes:x.votes+1}:x))} className="text-[#D4A017]">▲ {m.votes} تزكية</button></div>
                </div>
              ))}
              {majlis.length===0 && <div className="text-center text-white/30 py-10">لا قضايا بعد - كن أول من يطرح</div>}
            </div>
          )}

          {activeTab==='p2p' && (
            <div className="space-y-3">
              <div className="bg-[#111116] border border-[#D4A017]/20 rounded-2xl p-4 grid grid-cols-3 gap-2">
                <input id="p2pAmount" type="number" placeholder="المبلغ" className="bg-[#07070a] border border-white/10 rounded-xl px-3 py-2 outline-none" />
                <input id="p2pPrice" type="number" placeholder="السعر" className="bg-[#07070a] border border-white/10 rounded-xl px-3 py-2 outline-none" />
                <button onClick={()=>{
                  const a=Number(document.getElementById('p2pAmount').value)
                  const p=Number(document.getElementById('p2pPrice').value)
                  if(!a||!p) return alert('اكمل البيانات')
                  setP2pOrders(o=>[{id:Date.now(), amount:a, price:p, owner:user.name},...o])
                }} className="col-span-3 bg-[#D4A017] text-black py-2.5 rounded-xl font-bold mt-1">إنشاء عرض P2P</button>
              </div>
              {p2pOrders.map(o=>(
                <div key={o.id} className="bg-[#111116] border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                  <div><div className="font-bold text-[#D4A017]">{o.amount} دينار</div><div className="text-xs text-white/40">بواسطة {o.owner} • سعر {o.price}</div></div>
                  <button onClick={()=>{
                    if(balance < o.price) return alert('رصيدك لا يكفي')
                    setBalance(b=>b - o.price + o.amount)
                    setP2pOrders(list=>list.filter(x=>x.id!==o.id))
                  }} className="bg-white/10 px-4 py-2 rounded-xl text-sm">شراء</button>
                </div>
              ))}
            </div>
          )}

          {activeTab==='souq' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {souq.map(item=>(
                <div key={item.id} className="bg-[#111116] border border-[#D4A017]/20 rounded-2xl p-5">
                  <div className="text-xs text-[#D4A017] mb-1">{item.type}</div>
                  <div className="font-bold mb-1">{item.title}</div>
                  <div className="text-xs text-white/40 mb-4">البائع: {item.seller}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#D4A017] font-bold">{item.price} دينار</span>
                    <button onClick={()=>{
                      if(balance < item.price) return alert('رصيدك لا يكفي')
                      setBalance(b=>b-item.price)
                      alert('تم الشراء! سيصلك في الديوان')
                    }} className="bg-[#D4A017] text-black px-4 py-2 rounded-xl text-sm font-bold">شراء</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab==='diwan' && (
            <div className="bg-[#111116] border border-[#D4A017]/20 rounded-2xl p-4 space-y-2 max-h-[70vh] overflow-auto">
              {diwan.length===0? <div className="text-center text-white/30 py-10">الديوان فارغ - الشهادات ستظهر هنا</div> : diwan.map(d=>(
                <div key={d.id} className="bg-[#07070a] rounded-xl p-3 border border-white/5">
                  <div className="text-sm text-white/80">{d.text}</div>
                  <div className="text-[11px] text-white/30 mt-1">{d.time}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Admin Hidden */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-[#111116] border border-[#D4A017] rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-[#D4A017] font-bold text-xl mb-4">لوحة الأدمن المخفية ///</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>إجمالي المستخدمين (محلي)</span><span>1</span></div>
              <div className="flex justify-between"><span>إجمالي الرصيد</span><span>{balance}</span></div>
              <div className="flex justify-between"><span>الأحواض</span><span>{Object.keys(poolsStake).length}/6</span></div>
              <button onClick={()=>{localStorage.clear(); location.reload()}} className="w-full mt-4 bg-red-900/50 border border-red-500/30 text-red-300 py-3 rounded-xl">مسح كل البيانات - Reset</button>
              <button onClick={()=>setShowAdmin(false)} className="w-full mt-2 bg-[#D4A017] text-black py-3 rounded-xl font-bold">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-white/20 text-[10px] py-6">اكتب /// في أي مكان لفتح الأدمن • Witness Economy v2.0 Gold</div>
    </div>
  )
}
