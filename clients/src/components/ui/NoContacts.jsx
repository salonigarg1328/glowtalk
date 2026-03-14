import React from 'react'

function NoContacts() {
  return (
    <div className='flex flex-col items-center justify-center my-auto px-8'>
      {/* ✅ Purple-pink themed illustration */}
      <svg 
        className='w-[200px] h-[200px] mb-4' 
        viewBox="0 0 400 400" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="200" cy="200" r="180" fill="#fdf4ff" opacity="0.5"/>
        
        {/* Chat bubbles with purple-pink gradient */}
        <defs>
          <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#7c3aed', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#ec4899', stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        {/* Large chat bubble */}
        <path 
          d="M 120 150 Q 120 120, 150 120 L 250 120 Q 280 120, 280 150 L 280 210 Q 280 240, 250 240 L 180 240 L 160 260 L 165 240 Q 120 240, 120 210 Z" 
          fill="url(#chatGradient)" 
          opacity="0.9"
        />
        
        {/* Dots inside bubble */}
        <circle cx="170" cy="175" r="8" fill="white"/>
        <circle cx="200" cy="175" r="8" fill="white"/>
        <circle cx="230" cy="175" r="8" fill="white"/>
        
        {/* Small chat bubble */}
        <path 
          d="M 240 270 Q 240 250, 260 250 L 320 250 Q 340 250, 340 270 L 340 300 Q 340 320, 320 320 L 280 320 L 270 330 L 272 320 Q 240 320, 240 300 Z" 
          fill="#a855f7" 
          opacity="0.7"
        />
        
        {/* Heart icon */}
        <path 
          d="M 200 100 L 210 90 Q 220 80, 230 90 Q 240 100, 230 110 L 200 140 L 170 110 Q 160 100, 170 90 Q 180 80, 190 90 Z" 
          fill="#ec4899"
        />
        
        {/* Sparkles */}
        <circle cx="100" cy="120" r="4" fill="#a855f7" opacity="0.6"/>
        <circle cx="320" cy="150" r="3" fill="#ec4899" opacity="0.6"/>
        <circle cx="80" cy="250" r="3" fill="#7c3aed" opacity="0.6"/>
        <circle cx="340" cy="200" r="4" fill="#ec4899" opacity="0.6"/>
      </svg>
      
      {/* ✅ Updated text with purple-pink colors */}
      <h4 
        className='text-[22px] font-bold tracking-wide mb-2'
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        No Contacts Yet
      </h4>
      
      <span className='text-[14px] text-[#a855f7] font-medium tracking-wide'>
        Search for people to start chatting 💬
      </span>
    </div>
  )
}

export default NoContacts