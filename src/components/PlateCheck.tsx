'use client';

import { useState, useRef } from 'react';

interface MacroEstimate {
  protein: number;
  carbs: number;
  fats: number;
}

interface PyramidScore {
  overall: number;
  proteinQuality: string;
  vegetableScore: string;
  grainQuality: string;
}

interface KidFriendlyScore {
  emoji: string;
  message: string;
  stars: number;
}

interface AnalysisResult {
  foodItems: string[];
  macroEstimate: MacroEstimate;
  pyramidScore: PyramidScore;
  feedback: {
    strengths: string[];
    improvements: string[];
  };
  kidFriendlyScore: KidFriendlyScore;
  error?: string;
  rawResponse?: string;
}

export default function PlateCheck() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editedFoods, setEditedFoods] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [newFoodItem, setNewFoodItem] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    // Compress and resize image before processing
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      img.onload = () => {
        // Max dimension of 1024px for API efficiency
        const MAX_SIZE = 1024;
        let { width, height } = img;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress as JPEG at 85% quality
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedImage = canvas.toDataURL('image/jpeg', 0.85);
        
        setImage(compressedImage);
        setAnalysis(null);
        setError(null);
      };
      
      img.onerror = () => {
        // Fallback to original if image processing fails
        setImage(result);
        setAnalysis(null);
        setError(null);
      };
      
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract base64 data and media type from data URL
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Invalid image format');
      }

      const mediaType = matches[1];
      const base64Data = matches[2];

      const response = await fetch('/api/analyze-plate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Data,
          mediaType: mediaType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        setAnalysis(result);
        setEditedFoods(result.foodItems || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
    setEditedFoods([]);
    setEditingIndex(null);
    setEditingValue('');
    setNewFoodItem('');
    setHasChanges(false);
    setIsReanalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    
    // Scroll back to the snap section
    const snapSection = document.getElementById('snap');
    if (snapSection) {
      snapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEditFood = (index: number) => {
    setEditingValue(editedFoods[index]);
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number) => {
    if (editingValue.trim()) {
      const updated = [...editedFoods];
      updated[index] = editingValue.trim();
      setEditedFoods(updated);
      setHasChanges(true);
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleDeleteFood = (index: number) => {
    setEditedFoods(editedFoods.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleAddFood = () => {
    if (newFoodItem.trim()) {
      setEditedFoods([...editedFoods, newFoodItem.trim()]);
      setNewFoodItem('');
      setHasChanges(true);
    }
  };

  const reanalyzeWithEditedFoods = async () => {
    if (editedFoods.length === 0) return;

    setIsReanalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-plate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodItems: editedFoods,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to re-analyze');
      }

      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        setAnalysis(result);
        setEditedFoods(result.foodItems || editedFoods);
        setHasChanges(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleSaveEdit(index);
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!image ? (
        // Upload/Camera UI
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#F7F6F1] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Check Your Plate</h3>
            <p className="text-[#6B6B6B]">Take a photo or upload an image of your meal</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Camera Button */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-[#E5E5E5] rounded-xl hover:border-[#1A1A1A] hover:bg-[#F7F6F1] transition-all"
            >
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium text-[#1A1A1A]">Take Photo</span>
              <span className="text-xs text-[#6B6B6B]">Use your camera</span>
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-[#E5E5E5] rounded-xl hover:border-[#1A1A1A] hover:bg-[#F7F6F1] transition-all"
            >
              <div className="w-12 h-12 bg-[#F7F6F1] border-2 border-[#1A1A1A] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <span className="font-medium text-[#1A1A1A]">Upload Image</span>
              <span className="text-xs text-[#6B6B6B]">From your device</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      ) : !analysis ? (
        // Image Preview & Analyze
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
          <div className="relative">
            <img src={image} alt="Your meal" className="w-full h-auto max-h-[400px] object-cover" />
            <button
              onClick={resetAnalysis}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <svg className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 text-center">
            {error ? (
              <div className="text-red-600 mb-4">{error}</div>
            ) : null}
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="bg-[#1A1A1A] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#3D3D3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
            >
              {isAnalyzing ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Analyze My Plate
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        // Analysis Results
        <div className="space-y-6">
          {/* Kid-Friendly Score Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8 text-center">
            <div className="text-6xl mb-4">{analysis.kidFriendlyScore?.emoji || '🍽️'}</div>
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-2xl ${i < (analysis.kidFriendlyScore?.stars || 0) ? '' : 'opacity-30'}`}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-xl font-semibold text-[#1A1A1A] mb-2">
              {analysis.kidFriendlyScore?.message || 'Great effort!'}
            </p>
            <p className="text-[#6B6B6B]">
              Pyramid Score: <span className="font-semibold text-[#1A1A1A]">{analysis.pyramidScore?.overall || 0}/100</span>
            </p>
          </div>

          {/* Image with Food Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] overflow-hidden">
            <img src={image} alt="Your meal" className="w-full h-auto max-h-[300px] object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[#1A1A1A]">Foods Identified</h4>
                <span className="text-xs text-[#6B6B6B]">Click to edit • X to remove</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {editedFoods.map((item, i) => (
                  editingIndex === i ? (
                    <input
                      key={i}
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => handleSaveEdit(i)}
                      onKeyDown={(e) => handleEditKeyDown(e, i)}
                      autoFocus
                      className="bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] px-3 py-1 rounded-full text-sm outline-none min-w-[100px]"
                    />
                  ) : (
                    <span 
                      key={i} 
                      className="group bg-[#F7F6F1] text-[#3D3D3D] px-3 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-[#E5E5E5] transition-colors"
                    >
                      <span onClick={() => handleEditFood(i)}>{item}</span>
                      <button 
                        onClick={() => handleDeleteFood(i)}
                        className="ml-1 w-4 h-4 rounded-full bg-[#6B6B6B]/0 hover:bg-[#1A1A1A] hover:text-white flex items-center justify-center text-[#6B6B6B] transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  )
                ))}
              </div>
              {/* Add new food item */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFoodItem}
                  onChange={(e) => setNewFoodItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFood()}
                  placeholder="Add a food item..."
                  className="flex-1 bg-[#F7F6F1] text-[#1A1A1A] px-4 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#1A1A1A] placeholder:text-[#9A9A9A]"
                />
                <button
                  onClick={handleAddFood}
                  disabled={!newFoodItem.trim()}
                  className="bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#3D3D3D] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              {/* Update Analysis Button */}
              {hasChanges && (
                <button
                  onClick={reanalyzeWithEditedFoods}
                  disabled={isReanalyzing || editedFoods.length === 0}
                  className="mt-4 w-full bg-[#2E7D32] text-white px-4 py-3 rounded-full text-sm font-semibold hover:bg-[#1B5E20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isReanalyzing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Update Analysis
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Macro Breakdown - Pie Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-6">
            <h4 className="font-semibold text-[#1A1A1A] mb-4 text-center">Estimated Macros</h4>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Pie Chart */}
              <div className="relative">
                <div 
                  className="w-36 h-36 rounded-full transition-all duration-500"
                  style={{
                    background: `conic-gradient(
                      #C73E3A 0% ${analysis.macroEstimate?.protein || 0}%,
                      #D4A853 ${analysis.macroEstimate?.protein || 0}% ${(analysis.macroEstimate?.protein || 0) + (analysis.macroEstimate?.carbs || 0)}%,
                      #4A9B4F ${(analysis.macroEstimate?.protein || 0) + (analysis.macroEstimate?.carbs || 0)}% 100%
                    )`
                  }}
                />
                {/* Center hole for donut effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs text-[#6B6B6B]">100%</span>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#C73E3A]" />
                  <span className="text-sm text-[#3D3D3D]">Protein</span>
                  <span className="text-sm font-semibold text-[#1A1A1A] ml-auto">{analysis.macroEstimate?.protein || 0}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#D4A853]" />
                  <span className="text-sm text-[#3D3D3D]">Carbs</span>
                  <span className="text-sm font-semibold text-[#1A1A1A] ml-auto">{analysis.macroEstimate?.carbs || 0}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#4A9B4F]" />
                  <span className="text-sm text-[#3D3D3D]">Fats</span>
                  <span className="text-sm font-semibold text-[#1A1A1A] ml-auto">{analysis.macroEstimate?.fats || 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#E8F5E9] rounded-2xl p-6">
              <h4 className="font-semibold text-[#2E7D32] mb-3 flex items-center gap-2">
                <span>💪</span> Strengths
              </h4>
              <ul className="space-y-2">
                {analysis.feedback?.strengths?.map((item, i) => (
                  <li key={i} className="text-sm text-[#1B5E20] flex items-start gap-2">
                    <span className="text-[#4CAF50]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#FFF3E0] rounded-2xl p-6">
              <h4 className="font-semibold text-[#E65100] mb-3 flex items-center gap-2">
                <span>🎯</span> Room to Grow
              </h4>
              <ul className="space-y-2">
                {analysis.feedback?.improvements?.map((item, i) => (
                  <li key={i} className="text-sm text-[#BF360C] flex items-start gap-2">
                    <span className="text-[#FF9800]">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Try Again Button */}
          <div className="text-center">
            <button
              onClick={resetAnalysis}
              className="bg-white text-[#1A1A1A] font-semibold px-8 py-4 rounded-full hover:bg-[#F7F6F1] transition-colors inline-flex items-center gap-3 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Check Another Plate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
