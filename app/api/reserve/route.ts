import { NextRequest, NextResponse } from "next/server";
import { courses } from "@/data/courses";

interface CourseItem {
  id: string;
  name: string;
  price: number;
  seat: number;
  booked: number;
  date: string;
  tags: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { course, date, name, phone, people } = body;

    // 1. 필수 입력값 유효성 검사
    if (!name || !phone) {
      return NextResponse.json(
        { error: "이름과 연락처를 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    // 2. 서버 측에서 강좌 데이터 조회 후 결제 금액(total = 수강료 × 인원) 직접 계산
    const matchedCourse = courses.find(
      (c: CourseItem) => c.name === course || c.id === body.courseId
    );

    if (!matchedCourse) {
      return NextResponse.json(
        { error: "존재하지 않는 강좌입니다." },
        { status: 404 }
      );
    }

    const numPeople = Math.max(1, parseInt(String(people), 10) || 1);
    // 화면이 전달한 값이 아닌 서버가 보유한 공식 강좌 데이터의 수강료로 total 계산
    const total = matchedCourse.price * numPeople;

    // 3. .env 환경 변수의 SHEET_URL 확인 (브라우저에 비노출)
    const sheetUrl = process.env.SHEET_URL;
    if (!sheetUrl || !sheetUrl.trim()) {
      return NextResponse.json(
        {
          error:
            ".env 파일에 SHEET_URL이 설정되지 않았습니다. 프로젝트 루트 .env에 구글 시트 웹 앱 URL을 입력해 주세요.",
        },
        { status: 500 }
      );
    }

    // 4. 구글 시트 Apps Script 웹 앱으로 JSON 데이터 전송
    const payload = {
      date: date || matchedCourse.date,
      course: matchedCourse.name,
      name: String(name).trim(),
      phone: String(phone).trim(),
      people: numPeople,
      total: total,
    };

    const sheetResponse = await fetch(sheetUrl.trim(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let sheetResult;
    try {
      sheetResult = await sheetResponse.json();
    } catch {
      sheetResult = { result: "ok" };
    }

    return NextResponse.json({
      success: true,
      result: sheetResult.result || "ok",
      data: payload,
    });
  } catch (error: unknown) {
    console.error("Reservation API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "서버 처리 중 오류가 발생했습니다.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
