"use client";

import { useState } from "react";
import { courses } from "@/data/courses";

interface Course {
  id: string;
  name: string;
  price: number;
  seat: number;
  booked: number;
  date: string;
  tags: string[];
  description?: string;
  features?: string[];
}

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [people, setPeople] = useState<number>(1);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayedCourses = onlyAvailable
    ? courses.filter((course: Course) => {
        const remaining = Number(course.seat) - Number(course.booked);
        return remaining > 0;
      })
    : courses;

  const openReservationModal = (course: Course) => {
    setSelectedCourse(course);
    setName("");
    setPhone("");
    setPeople(1);
  };

  const closeReservationModal = () => {
    if (isSubmitting) return;
    setSelectedCourse(null);
  };

  // [신청] 버튼 클릭 시 서버 API(/api/reserve) 호출
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || isSubmitting) return;

    if (!name.trim()) {
      alert("이름을 입력해 주세요.");
      return;
    }
    if (!phone.trim()) {
      alert("연락처를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 결제 금액(total)은 화면이 보내지 않고, 서버가 직접 공식 데이터로 계산합니다.
      const response = await fetch("/api/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: selectedCourse.name,
          courseId: selectedCourse.id,
          date: selectedCourse.date,
          name: name.trim(),
          phone: phone.trim(),
          people: people || 1,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "예약 신청 처리에 실패했습니다.");
      }

      alert(`[${selectedCourse.name}] 예약 신청이 성공적으로 접수되었습니다!`);
      setSelectedCourse(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "예약 신청 중 오류가 발생했습니다.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b19] text-slate-100 flex flex-col justify-between relative selection:bg-[#d4af37] selection:text-[#060b19]">
      {/* 배경 장식 (남색 심도 + 골드 은은한 반사광) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.12)_0%,_rgba(10,20,48,0.8)_50%,_rgba(6,11,25,0)_100%)] pointer-events-none" />
      <div className="absolute top-80 right-0 w-96 h-96 bg-[radial-gradient(circle,_rgba(212,175,55,0.05)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[radial-gradient(circle,_rgba(30,58,138,0.2)_0%,_transparent_70%)] pointer-events-none" />

      {/* 상단 네비게이션 */}
      <header className="relative z-10 w-full border-b border-[#d4af37]/20 bg-[#080f24]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 금색 심볼 로고 */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5d061] via-[#d4af37] to-[#aa8214] p-[1px] shadow-lg shadow-[#d4af37]/20">
              <div className="w-full h-full rounded-[11px] bg-[#09112a] flex items-center justify-center">
                <span className="text-[#f5d061] font-black text-lg tracking-wider">S</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  스킬투머니
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#d4af37]/15 text-[#f5d061] border border-[#d4af37]/30">
                  Skill to Money
                </span>
              </div>
              <p className="text-[11px] text-[#c5a059] tracking-tight">배운 기술이 돈이 되는 실전 원데이 클래스</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0d1a3d] border border-[#d4af37]/40 text-[#f5d061]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              실시간 예약 접수 중
            </span>
          </div>
        </div>
      </header>


      {/* 메인 콘텐츠 영역 */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-12 sm:py-16">
        {/* 히어로 타이틀 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1a3d]/90 border border-[#d4af37]/40 text-[#f5d061] text-xs sm:text-sm font-semibold mb-5 shadow-inner">
            <span className="text-amber-300">✦</span>
            <span>수익화 원데이 마스터 클래스</span>
            <span className="text-amber-300">✦</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
            스킬투머니 <span className="bg-gradient-to-r from-[#f5d061] via-[#ffd700] to-[#d4af37] bg-clip-text text-transparent">강좌 목록</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto break-keep">
            복잡한 이론 대신 내일부터 바로 현금 흐름을 만드는 실전 기술 4가지.<br className="hidden sm:inline" />
            원하는 강좌의 <strong className="text-[#f5d061] font-semibold">[예약하기]</strong> 버튼을 눌러 지금 신청하세요.
          </p>
        </div>

        {/* 강좌 목록 상단 필터 영역: 예약 가능한 강좌만 보기 */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-[#c5a059]">
              총 <span className="text-white font-bold">{displayedCourses.length}개</span> 강좌
            </span>
            {onlyAvailable && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold">
                예약 가능 강좌만 표시 중
              </span>
            )}
          </div>

          {/* 예약 가능한 강좌만 보기 필터 버튼 */}
          <button
            type="button"
            id="only-available-filter-btn"
            onClick={() => setOnlyAvailable((prev) => !prev)}
            aria-pressed={onlyAvailable}
            className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer select-none border font-semibold text-xs sm:text-sm ${
              onlyAvailable
                ? "bg-[#d4af37]/20 border-[#f5d061] text-[#f5d061] shadow-lg shadow-[#d4af37]/15 ring-1 ring-[#f5d061]/40"
                : "bg-[#09122c]/90 border-[#d4af37]/30 text-slate-300 hover:text-white hover:border-[#f5d061]/60"
            }`}
          >
            {/* 시각적 체크박스 아이콘 */}
            <span
              className={`w-4 h-4 rounded flex items-center justify-center transition-colors border ${
                onlyAvailable
                  ? "bg-[#d4af37] border-[#d4af37] text-[#060b19]"
                  : "border-slate-600 bg-slate-900/80"
              }`}
            >
              {onlyAvailable && (
                <svg
                  className="w-3 h-3 stroke-current stroke-[3] fill-none"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span>예약 가능한 강좌만 보기</span>
          </button>
        </div>

        {/* 강좌 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {displayedCourses.map((course: Course) => {
            const remainingSeats = Math.max(0, Number(course.seat) - Number(course.booked));
            const isClosed = remainingSeats <= 0;
            const isUrgent = remainingSeats >= 1 && remainingSeats <= 2;

            return (
              <div
                key={course.id}
                className={`group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#0c1633] to-[#081026] border transition-all duration-300 p-6 overflow-hidden ${
                  isClosed
                    ? "border-slate-800/80 opacity-90"
                    : "border-[#d4af37]/25 hover:border-[#f5d061]/70 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#d4af37]/15"
                }`}
              >
                {/* 카드 상단 골드/레드/슬레이트 라인 */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[3px] ${
                    isClosed
                      ? "bg-slate-700"
                      : isUrgent
                      ? "bg-gradient-to-r from-red-500 via-rose-400 to-red-500"
                      : "bg-gradient-to-r from-[#aa8214] via-[#f5d061] to-[#aa8214]"
                  } opacity-80 group-hover:opacity-100 transition-opacity`}
                />

                <div>
                  {/* 상단 구분 & 일정 */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${
                        isClosed
                          ? "bg-slate-800 text-slate-400 border-slate-700"
                          : "bg-blue-950/60 border-blue-500/30 text-blue-300"
                      }`}
                    >
                      {isClosed ? "접수 마감" : "원데이 클래스"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      📅 {course.date}
                    </span>
                  </div>

                  {/* 강좌 이름 */}
                  <h2
                    className={`text-2xl font-bold transition-colors ${
                      isClosed
                        ? "text-slate-300"
                        : "text-white group-hover:text-[#f5d061]"
                    }`}
                  >
                    {course.name}
                  </h2>

                  {/* 강좌 이름 아래 작은 배지 (tags) */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5 mb-4">
                    {course.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          isClosed
                            ? "bg-slate-800/80 text-slate-400 border border-slate-700"
                            : "bg-[#0d1a3d] text-[#f5d061] border border-[#d4af37]/30"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 강좌 설명 */}
                  {course.description && (
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed break-keep min-h-[36px]">
                      {course.description}
                    </p>
                  )}

                  {/* 좌석 현황: 남은 좌석 ○석 / 정원 ○명 */}
                  <div className="mb-5 p-3 rounded-xl bg-[#080f24] border border-[#d4af37]/20">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">
                        남은 좌석{" "}
                        <span
                          className={`font-bold ${
                            isClosed
                              ? "text-slate-400"
                              : isUrgent
                              ? "text-red-500"
                              : "text-[#f5d061]"
                          }`}
                        >
                          {remainingSeats}석
                        </span>{" "}
                        / 정원 {course.seat}명
                      </span>

                      {/* 상태 표시: 0석이면 '마감', 1~2석이면 빨간색 '마감 임박', 3석 이상이면 '예약 가능' */}
                      {isClosed ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          마감
                        </span>
                      ) : isUrgent ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-950/80 text-red-500 border border-red-500/70 animate-pulse">
                          마감 임박
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                          예약 가능
                        </span>
                      )}
                    </div>

                    {/* 게이지 바 */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isClosed
                            ? "bg-slate-600"
                            : isUrgent
                            ? "bg-red-500"
                            : "bg-gradient-to-r from-[#d4af37] to-[#f5d061]"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((course.booked / course.seat) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* 실습 혜택 / 특징 체크리스트 */}
                  {course.features && (
                    <div className="space-y-2 mb-6 pt-3 border-t border-[#d4af37]/15">
                      {course.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-200">
                          <span className={isClosed ? "text-slate-500" : "text-[#f5d061] font-bold mt-0.5"}>
                            ✔
                          </span>
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 하단 가격 & 예약하기 버튼 */}
                <div className="pt-5 border-t border-[#d4af37]/20 mt-auto">
                  {/* 수강료 표시 */}
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs text-[#c5a059] font-medium">수강료</span>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 line-through mr-2">
                        {(course.price * 2).toLocaleString()}원
                      </span>
                      <span
                        className={`text-2xl font-black ${
                          isClosed
                            ? "text-slate-300"
                            : "bg-gradient-to-r from-[#f5d061] to-[#ffd700] bg-clip-text text-transparent"
                        }`}
                      >
                        {course.price.toLocaleString()}
                      </span>
                      <span className={`text-base font-bold ml-0.5 ${isClosed ? "text-slate-400" : "text-[#f5d061]"}`}>
                        원
                      </span>
                    </div>
                  </div>

                  {/* [예약하기] 버튼: 남은 좌석이 0이면 '예약 마감'으로 바꿔 누를 수 없게 처리 */}
                  <button
                    type="button"
                    disabled={isClosed}
                    onClick={() => !isClosed && openReservationModal(course)}
                    className={`w-full py-3 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                      isClosed
                        ? "bg-slate-800/90 text-slate-400 border border-slate-700 cursor-not-allowed select-none shadow-none"
                        : "bg-gradient-to-r from-[#d4af37] via-[#f5d061] to-[#b8860b] text-[#060b19] shadow-lg shadow-[#d4af37]/20 hover:shadow-xl hover:shadow-[#d4af37]/35 hover:brightness-105 active:scale-[0.98] cursor-pointer"
                    }`}
                  >
                    <span>{isClosed ? "예약 마감" : "예약하기"}</span>
                    {!isClosed && <span className="font-bold">→</span>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 신뢰 포인트 3대 혜택 */}
        <div className="mt-14 sm:mt-18 grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-[#091129]/70 border border-[#d4af37]/20 backdrop-blur-sm text-center">
          <div className="py-2">
            <div className="text-[#f5d061] text-lg font-bold mb-1">👑 100% 실전 중심</div>
            <p className="text-xs text-slate-400">현업에서 바로 돈이 되는 내용만 압축</p>
          </div>
          <div className="py-2 border-y sm:border-y-0 sm:border-x border-[#d4af37]/20">
            <div className="text-[#f5d061] text-lg font-bold mb-1">🎁 평생 소장 자료</div>
            <p className="text-xs text-slate-400">강의 요약본 & 실무 템플릿 무제한 제공</p>
          </div>
          <div className="py-2">
            <div className="text-[#f5d061] text-lg font-bold mb-1">💬 강사 1:1 Q&A</div>
            <p className="text-xs text-slate-400">수강 후 질의응답 및 피드백 케어</p>
          </div>
        </div>
      </main>

      {/* 예약 신청 모달 팝업 */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0b142e] border border-[#d4af37]/40 p-6 sm:p-7 shadow-2xl shadow-[#d4af37]/20 text-white">
            {/* 상단 닫기 X 버튼 */}
            <button
              onClick={closeReservationModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              ✕
            </button>

            <div>
              <div className="inline-block px-2.5 py-1 rounded bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f5d061] text-xs font-bold mb-3">
                수강 예약 신청
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                강좌 예약 신청서
              </h3>

              <form onSubmit={handleApply} className="space-y-4">
                {/* 1. 강좌 이름 (카드에서 자동 채움) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    강좌 이름
                  </label>
                  <input
                    type="text"
                    value={selectedCourse.name}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060b18] border border-slate-700/80 text-[#f5d061] text-sm font-bold select-none cursor-not-allowed outline-none"
                  />
                </div>

                {/* 2. 날짜 (카드에서 자동 채움) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    날짜
                  </label>
                  <input
                    type="text"
                    value={selectedCourse.date}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060b18] border border-slate-700/80 text-slate-300 text-sm font-semibold select-none cursor-not-allowed outline-none"
                  />
                </div>

                {/* 3. 이름 입력 칸 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    이름 <span className="text-[#f5d061]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="이름을 입력해 주세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d20] border border-[#d4af37]/30 text-white text-sm focus:outline-none focus:border-[#f5d061] focus:ring-1 focus:ring-[#f5d061] placeholder:text-slate-500"
                  />
                </div>

                {/* 4. 연락처 입력 칸 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    연락처 <span className="text-[#f5d061]">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d20] border border-[#d4af37]/30 text-white text-sm focus:outline-none focus:border-[#f5d061] focus:ring-1 focus:ring-[#f5d061] placeholder:text-slate-500"
                  />
                </div>

                {/* 5. 인원(숫자) 입력 칸 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-200">
                      인원 <span className="text-[#f5d061]">*</span>
                    </label>
                    <span className="text-[11px] text-[#c5a059]">
                      (남은 좌석: {selectedCourse.seat - selectedCourse.booked}석)
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, selectedCourse.seat - selectedCourse.booked)}
                    value={people}
                    onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d20] border border-[#d4af37]/30 text-white text-sm focus:outline-none focus:border-[#f5d061] focus:ring-1 focus:ring-[#f5d061]"
                  />
                </div>

                {/* 결제 예상 금액 요약 */}
                <div className="p-3 rounded-xl bg-[#070d20] border border-[#d4af37]/20 flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-400">결제 예상 금액 ({selectedCourse.price.toLocaleString()}원 × {people || 1}명)</span>
                  <span className="text-base font-black text-[#f5d061]">
                    {(selectedCourse.price * (people || 1)).toLocaleString()}원
                  </span>
                </div>

                {/* 하단 [닫기]와 [신청] 버튼 */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={closeReservationModal}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-bold text-sm transition-colors cursor-pointer"
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d061] to-[#b8860b] disabled:opacity-60 disabled:cursor-not-allowed text-[#060b19] font-black text-sm shadow-md shadow-[#d4af37]/20 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#060b19] border-t-transparent rounded-full animate-spin"></span>
                        <span>신청 중...</span>
                      </>
                    ) : (
                      <span>신청</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="relative z-10 w-full border-t border-[#d4af37]/15 py-8 px-6 text-center text-xs text-[#c5a059]/70 bg-[#040813]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#f5d061]">스킬투머니</span>
            <span>| 배운 기술이 돈이 되는 원데이 클래스</span>
          </div>
          <p>© {new Date().getFullYear()} SkillToMoney. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
