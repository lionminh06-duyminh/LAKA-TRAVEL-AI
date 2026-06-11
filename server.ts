import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Function to generate extremely customized mock itineraries based on destination and vibe
function generateMockItinerary(destination: string, vibe: string, reqs: any) {
  const destName = destination.trim();
  const days = reqs.days || 2;
  
  // Custom slang definitions
  const slangsMap: Record<string, {word: string, meaning: string}[]> = {
    'đà lạt': [
      { word: "Ăn bánh tráng nướng", meaning: "Pizza Đà Lạt thần thánh, vừa ăn vừa thổi giữa trời lạnh" },
      { word: "Ăn cơm lam gà nướng", meaning: "Đặc sản nhất định phải thử nếu không mông lung như một trò đùa" },
      { word: "Săn mây", meaning: "Dậy từ 4h sáng lạnh run người để flex ảnh mây trời cực chill" }
    ],
    'hà nội': [
      { word: "Trà chanh Chợ Gạo", meaning: "Nét văn hoá góc phố buôn dưa lê xả stress" },
      { word: "Cà phê trứng", meaning: "Vị béo ngậy đẳng cấp, uống một ngụm là say đắm" },
      { word: "Lượn hồ Tây", meaning: "Đi xe máy vòng hồ hóng gió tìm kiếm định mệnh đời mình" }
    ],
    'phú quốc': [
      { word: "Bún quậy", meaning: "Tự quậy nước chấm mỏi tay mệt nghỉ nhưng ăn siêu cuốn" },
      { word: "Sunset ngắm biển", meaning: "Hoàng hôn Phú Quốc đỉnh chóp, chụp phát nào ăn phát nấy" }
    ]
  };

  const destLower = destName.toLowerCase();
  let slangs = [
    { word: "Đi trốn", meaning: "Xách balo lên xả stress cực mạnh sau những giờ chạy deadline nghẹt thở" },
    { word: "Cháy máy", meaning: "Chụp ảnh lia lịa đến khi dung lượng iCloud đầy ắp" },
    { word: "Ăn sập", meaning: "Càn quét mọi ngõ ngách ẩm thực, bỏ qua nỗi sợ cân nặng" }
  ];
  
  for (const k of Object.keys(slangsMap)) {
    if (destLower.includes(k)) {
      slangs = slangsMap[k];
    }
  }

  // Create customized days plan
  const daysPlan = [];
  for (let i = 1; i <= days; i++) {
    let theme = "";
    let acts = [];
    
    if (vibe === 'Foodie') {
      theme = `Ngày ${i}: Ăn Sập Nguồn - Không No Không Về`;
      acts = [
        {
          title: "Ăn sáng đặc sản địa phương",
          description: `Bắt đầu ngày mới tại tiệm ăn gia truyền nức tiếng ${destName}. Hương vị đậm đà, chuẩn gu chuẩn vị Việt!`,
          location: `Khu phố ẩm thực trung tâm ${destName}`,
          timeOfDay: "Morning",
          approxCost: "45.000đ - 65.000đ",
          tip: "Nên ghé sớm trước 8h kẻo xếp hàng mê mỏi mệt mỏi nhé."
        },
        {
          title: "Tour ăn vặt xế trưa",
          description: "Tìm kiếm các món ăn đường phố độc lạ, sữa chua, chè, bánh tráng trộn hay đặc sản xế phố cực cuốn.",
          location: "Chợ địa phương sầm uất",
          timeOfDay: "Noon",
          approxCost: "30.000đ - 50.000đ",
          tip: "Mang theo tiền mặt vì nhiều quán cô chú không xài chuyển khoản đâu nè."
        },
        {
          title: "Săn đồ uống 'Gây Nghiện'",
          description: "Ghé quán cafe vibe cực thơ, nhâm nhi ly nước signature ngon tê lưỡi, chill cùng hội bạn.",
          location: "Quán cafe phong cách Indie cổ điển",
          timeOfDay: "Afternoon",
          approxCost: "40.000đ - 60.000đ",
          tip: "Góc bàn cửa sổ ánh nắng chiếu xiên qua chụp ảnh xịn đét."
        },
        {
          title: "Càn quét phố ẩm thực đêm",
          description: "Bữa tối hoành tráng với lẩu, nướng hoặc hải sản ngập mặt. Ăn bất chấp thế gian quên hết âu lo.",
          location: "Phố ẩm thực đêm hoặc chợ đêm",
          timeOfDay: "Evening",
          approxCost: "150.000đ - 250.000đ",
          tip: "Ưu tiên mặc đồ rộng rãi phóng khoáng để tăng diện tích chứa đồ ăn nha."
        }
      ];
    } else if (vibe === 'Indie') {
      theme = `Ngày ${i}: Góc Thơ Trầm Lặng - Flexing Phong Cách`;
      acts = [
        {
          title: "Rảo bước đường phố ngắm kiến trúc cổ",
          description: "Dạo quanh những con ngõ vắng người, hít hà không khí trong lành buổi sớm và ngắm nhìn những góc tường nhuốm màu thời gian.",
          location: "Khu phố cổ lâu năm",
          timeOfDay: "Morning",
          approxCost: "Miễn phí",
          tip: "Bật một list nhạc lofi của Vũ hoặc Ngọt để hành trình thêm phần lãng mạn."
        },
        {
          title: "Đọc sách & u mê cà phê phin thủ công",
          description: "Một quán nhỏ trú ẩn trong ngõ sâu. Nơi có mùi gỗ thông thơm nhẹ dã man, nhạc jazz nhẹ nhàng cực keo.",
          location: "Tổ hợp sách và cafe nghệ thuật",
          timeOfDay: "Noon",
          approxCost: "50.000đ - 80.000đ",
          tip: "Nơi này yêu cầu giữ im lặng nhẹ nhàng để sạc pin tâm hồn đó."
        },
        {
          title: "Check-in bảo tàng / triển lãm nghệ thuật",
          description: "Khám phá các không gian sáng tạo, ngắm những bức tranh hoặc tác phẩm điêu khắc đương đại mang tính nghệ thuật cao.",
          location: "Bảo tàng nghệ thuật thành phố",
          timeOfDay: "Afternoon",
          approxCost: "20.000đ - 40.000đ",
          tip: "Phù hợp diện outfit tone màu trung tính mộc mạc như kem, nâu đất."
        },
        {
          title: "Acoustic Live Music sạc lại năng lượng",
          description: "Đắm chìm vào đêm nhạc live sâu lắng, nơi các nghệ sĩ indie trình diễn những bản nhạc mộc mạc đi vào lòng người.",
          location: "Quán cafe nhạc mộc ấm cúng",
          timeOfDay: "Evening",
          approxCost: "90.000đ - 150.000đ",
          tip: "Nên đặt bàn trước qua fanpage để có chỗ ngồi cận sân khấu nhất."
        }
      ];
    } else if (vibe === 'Maximalism') {
      theme = `Ngày ${i}: Check-in Cháy Máy - Chạy Deadline Du Hí`;
      acts = [
        {
          title: "Dậy sớm oanh tạc cổng check-in quốc dân",
          description: "Có mặt lúc bình minh để lấy trọn khung cảnh biểu tượng mà không dính người. Chụp 7749 kiểu ảnh xịn sò.",
          location: "Quảng trường trung tâm / Cầu kính nổi tiếng",
          timeOfDay: "Morning",
          approxCost: "Miễn phí",
          tip: "Nhớ sạc đầy pin điện thoại và sạc dự phòng 10.000mAh tối thiểu."
        },
        {
          title: "Trải nghiệm văn hoá cực độc lạ",
          description: "Mua sắm, trải nghiệm thuê trang phục truyền thống hoặc tham quan các làng nghề truyền thống.",
          location: "Hợp tác xã văn hoá du lịch",
          timeOfDay: "Noon",
          approxCost: "100.000đ - 200.000đ",
          tip: "Kha khá góc decor rực rỡ sắc màu tôn dáng cực kỳ."
        },
        {
          title: "Cafe view 360 độ ngắm toàn thành phố",
          description: "Thưởng thức trà chiều cao cấp tại tầng thượng cao vút bay, săn hoàng hôn đỏ rực buông xuống đường chân trời.",
          location: "Sky Lounge tầng cao nhất",
          timeOfDay: "Afternoon",
          approxCost: "80.000đ - 150.000đ",
          tip: "Canh góc máy từ dưới lên để lấy được cả bầu trời bao la phía sau."
        },
        {
          title: "Hóng gió ăn nhậu ngắm đèn lên",
          description: "Thưởng thức những món lẩu nướng ngập tràn, kết thúc ngày vui hết mình đầy ắp kho dữ liệu ảnh tuyệt đẹp.",
          location: "Quán nướng vỉa hè view cực Chill",
          timeOfDay: "Evening",
          approxCost: "150.000đ - 300.000đ",
          tip: "Tải ngay ảnh lên drive sao lưu trước khi quẩy lỡ rơi điện thoại nha."
        }
      ];
    } else if (vibe === 'Nightlife') {
      theme = `Ngày ${i}: Quẩy Đêm Nhiệt Huyết - Ngủ Ngày Cày Đêm`;
      acts = [
        {
          title: "Ngủ nướng hồi sức dài hơi",
          description: "Dậy trễ sau một đêm dài quẩy hết lực, tạt qua làm tô hủ tiếu hay tô phở bốc khói sương sương.",
          location: "Quán ăn gia truyền gần chỗ lưu trú",
          timeOfDay: "Morning",
          approxCost: "45.000đ",
          tip: "Dành thời gian buổi sáng thong thả để giữ sức cho đêm nay."
        },
        {
          title: "Cafe bệt buôn dưa lê tán dóc",
          description: "Ngồi lề đường, ngắm dòng người qua lại, nhâm nhi ly nước mát lạnh chém gió xàm xí cùng hội bạn bè.",
          location: "Công viên trung tâm hoặc vỉa hè cổ",
          timeOfDay: "Noon",
          approxCost: "25.000đ",
          tip: "Trang phục thoải mái, mang kính mát râm ngầu lòi."
        },
        {
          title: "Tút lại nhan sắc mua đồ đi cháy phố",
          description: "Lượn lờ các shop local brand săn những chiếc áo mỏng nhẹ cá tính chuẩn bị set đồ lấp lánh cho show tối.",
          location: "Khu mua sắm thời trang trẻ trung",
          timeOfDay: "Afternoon",
          approxCost: "Vào xem miễn phí",
          tip: "Nên hỏi trước xem shop có cho thử đồ thoải mái không nhé."
        },
        {
          title: "Rực lửa phố Tây không ngủ",
          description: "Hoà mình vào tiếng nhạc sôi động xập xình, thử vài ly cocktail thơm ngọt hoặc ly bia mát lạnh xả stress sướng rơn.",
          location: "Phố Tây đi bộ nhộn nhịp",
          timeOfDay: "Evening",
          approxCost: "150.000đ - 350.000đ",
          tip: "Tuyệt đối không uống quá chén và luôn chọn đi grab về cho an toàn tối đa."
        }
      ];
    } else { // Chill (Default)
      theme = `Ngày ${i}: Healing Êm Đềm - Chữa Lành Deadline`;
      acts = [
        {
          title: "Thức dậy muộn chill trọn không khí sương mai",
          description: "Thức giấc lúc 9h sáng, đi bộ nhẹ nhàng hít thở không khí dịu nhẹ trong lành không ồn ào khói bụi.",
          location: "Công viên hay ven hồ yên ả",
          timeOfDay: "Morning",
          approxCost: "Miễn phí",
          tip: "Hạn chế mở các app công việc hay kiểm tra tin bão deadline."
        },
        {
          title: "Bữa trưa thảnh thơi nhâm nhi đặc sản",
          description: "Thưởng thức những món súp, phở nóng hổi hay dĩa cơm nhẹ bụng cực ngon lành, thanh mát.",
          location: "Nhà hàng vườn tược mộc mạc",
          timeOfDay: "Noon",
          approxCost: "60.000đ - 100.000đ",
          tip: "Ngồi xích đu ngắm cây xanh thơ thẩn chữa lành tuyệt đối."
        },
        {
          title: "Ngắm hoàng hôn xịn sò yên bĩnh",
          description: "Ghé một góc ban công mát rượi, ngắm mặt trời chuyển màu đỏ lựng rớt dần xuống núi / biển thơ thẩn dã man.",
          location: "Cà phê gác mái ven biển / đồi",
          timeOfDay: "Afternoon",
          approxCost: "45.000đ - 70.000đ",
          tip: "Tắt thông báo điện thoại 1 tiếng để đắm chìm trọn vẹn vào tự nhiên."
        },
        {
          title: "Tiệc BBQ lãng mạn nhẹ nhàng",
          description: "Tận hưởng làn gió mát lành cùng bữa tối BBQ ấm cúng thơm nức mũi bên ánh đèn lung linh.",
          location: "Sân vườn glamping ấm áp",
          timeOfDay: "Evening",
          approxCost: "200.000đ - 350.000đ",
          tip: "Ngồi quanh đống lửa ôm đàn nghêu ngao vài câu hát thì keo lỳ khỏi bàn."
        }
      ];
    }
    
    daysPlan.push({
      dayNumber: i,
      theme,
      activities: acts
    });
  }

  return {
    destination: destName,
    vibe,
    days,
    budget: reqs.budget,
    title: `Quẩy Sập ${destName}: ${days} Ngày ${vibe} Cực Cháy!`,
    tagline: `LaKa đi, nghỉ làm chi - Hành trình ${vibe} oanh tạc ${destName} cùng cạ cứng!`,
    estimatedTotal: reqs.budget === 'economy' ? "1.200.000đ - 1.800.000đ / người" : reqs.budget === 'moderate' ? "2.500.000đ - 3.500.000đ / người" : "5.000.000đ - 8.000.000đ / người",
    daysPlan,
    genZRecommendations: [
      "Check-in đúng mốc giờ vàng để thu hoạch ảnh nghìn tim khét lẹt.",
      "Thử hết những món độc lạ đặc sản lề đường không lo sợ gầy sút.",
      "Mang giày mềm thể thao năng động hoặc sandal cá tính đề phòng cuốc bộ dẻo dai."
    ],
    localSlangs: slangs
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Let's implement the API routes FIRST
  app.post("/api/generate-itinerary", async (req, res) => {
    const { destination, vibe, requirements } = req.body;
    
    if (!destination || !vibe || !requirements) {
      return res.status(400).json({ error: "Missing required parameters: destination, vibe, and requirements are needed." });
    }

    const { days, budget, companions, pace, priorities } = requirements;

    // Check for API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured or uses placeholder. Falling back to dynamic mock generator.");
      const mockResult = generateMockItinerary(destination, vibe, requirements);
      return res.json(mockResult);
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Bạn là LaKa, một trợ lý lên kế hoạch du lịch cực kỳ năng động, hài hước, dùng ngôn ngữ Gen Z Việt Nam (sử dụng một cách tự nhiên các từ như "mê chữ ê kéo dài", "mãi mận", "keo lỳ", "flex", "ét o ét", "gét gô",...).
Lên một kế hoạch du lịch chi tiết và thực tế cho chuyến đi đến: ${destination}.
Các thông số chuyến đi:
- Vibe (vần, tần số năng lượng): ${vibe} (Chill: thư giãn; Foodie: ăn uống sập sàn; Indie: nghệ thuật và yên bình; Maximalism: chụp ảnh cháy máy, đi kín lịch; Nightlife: quẩy đêm hết mình).
- Số ngày: ${days} ngày.
- Ngân sách: hạng ${budget === 'economy' ? 'tiết kiệm sinh viên' : budget === 'moderate' ? 'vừa vặn' : 'sang chảnh tẹt ga'}.
- Đi cùng: ${companions === 'solo' ? 'đi một mình tự do' : companions === 'couple' ? 'người yêu keo lỳ' : companions === 'friends' ? 'hội cạ cứng' : 'gia dịch ấm áp'}.
- Nhịp độ: ${pace === 'relaxed' ? 'thong thả nằm hưởng thụ' : pace === 'balanced' ? 'vừa phải cân bằng' : 'điên cuồng check-in'}.
- Ưu tiên: ${priorities.join(", ")}.

Hãy tạo một lịch trình Day-by-Day. Mỗi ngày phân chia thành 4 mốc thời gian: "Morning" (Sáng), "Noon" (Trưa), "Afternoon" (Chiều), "Evening" (Tối) với những địa điểm thực tế tại ${destination}, chi tiết giá cả ước tính bằng VNĐ, mẹo hay/góc chụp ảnh đậm chất Gen Z.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Bạn là chuyên gia du lịch Gen Z Việt Nam hài hước, năng động và sâu sắc. Trả về đúng định dạng JSON theo đúng schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING },
              vibe: { type: Type.STRING },
              days: { type: Type.INTEGER },
              budget: { type: Type.STRING },
              title: { type: Type.STRING, description: "Tiêu đề chuyến đi cực 'cháy' bằng tiếng Việt, ví dụ: 'Hà Nội Không Vội Được Đâu: Quẩy Sập Phố Cổ 3 Ngày'" },
              tagline: { type: Type.STRING, description: "Slogan hài hước nhí nhảnh đậm chất Gen Z Việt" },
              estimatedTotal: { type: Type.STRING, description: "Ước tính tổng chi phí, ví dụ: '1.200.000đ - 1.800.000đ / người'" },
              daysPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    theme: { type: Type.STRING, description: "Tên chủ đề ngày đó cực ngầu, kiểu: 'Oanh tạc hết phố ẩm thực'" },
                    activities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING, description: "Tên hoạt động hành trình" },
                          description: { type: Type.STRING, description: "Mô tả hoạt động siêu hài hước và hữu ích" },
                          location: { type: Type.STRING, description: "Tên địa danh/quán ăn thực tế" },
                          timeOfDay: { type: Type.STRING, description: "Bắt buộc chọn 1 trong: Morning, Noon, Afternoon, Evening" },
                          approxCost: { type: Type.STRING, description: "Chi phí ước tính" },
                          tip: { type: Type.STRING, description: "Mẹo nhỏ, góc sống ảo" }
                        },
                        required: ["title", "description", "location", "timeOfDay", "approxCost", "tip"]
                      }
                    }
                  },
                  required: ["dayNumber", "theme", "activities"]
                }
              },
              genZRecommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Danh sách 3-4 lời khuyên sống còn khi đi chuyến này"
              },
              localSlangs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    meaning: { type: Type.STRING }
                  },
                  required: ["word", "meaning"]
                },
                description: "Các thuật ngữ địa phương hoặc tiếng lóng vui vẻ dùng cho chuyến đi"
              }
            },
            required: ["destination", "vibe", "days", "budget", "title", "tagline", "estimatedTotal", "daysPlan", "genZRecommendations", "localSlangs"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini API");
      }
      
      const itinerary = JSON.parse(responseText.trim());
      return res.json(itinerary);

    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      const mockResult = generateMockItinerary(destination, vibe, { days, budget, companions, pace, priorities });
      return res.json({
        ...mockResult,
        isDemo: true,
        generationError: error.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
