"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface PriceReport {
  id: string;
  product_name: string;
  price: number;
  report_date: string;
  currency: string;
  reporter_nickname: string;
  is_verified: boolean;
  certification_id: string;
  store_id: string;
  stores?: {
    store_name: string;
    store_area: string;
  };
}

export default function ReportAdminPage() {
  const [reports, setReports] = useState<PriceReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<PriceReport[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState("전체");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedReport, setEditedReport] = useState<Partial<PriceReport>>({});
  const [newReport, setNewReport] = useState<Omit<PriceReport, "id" | "report_date" | "stores">>({
    product_name: "",
    price: 0,
    currency: "JPY",
    reporter_nickname: "",
    is_verified: false,
    certification_id: "",
    store_id: "",
  });

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("price_reports")
      .select("*, stores(store_name, store_area)")
      .order("report_date", { ascending: false });

    if (!error && data) {
      const result = data as PriceReport[];
      setReports(result);
      setFilteredReports(result);
      const areaList = Array.from(
        new Set(result.map((r) => r.stores?.store_area).filter(Boolean))
      ) as string[];
      setAreas(["전체", ...areaList]);
    }
  };

  const handleAreaFilter = (area: string) => {
    setSelectedArea(area);
    if (area === "전체") {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter((r) => r.stores?.store_area === area);
      setFilteredReports(filtered);
    }
  };

  const handleCreate = async () => {
    if (!newReport.product_name || !newReport.store_id || !newReport.price) {
      alert("상품명, 가격, 지점은 필수입니다.");
      return;
    }

    const { error } = await supabase.from("price_reports").insert({
      id: uuidv4(),
      ...newReport,
      report_date: new Date().toISOString(),
    });

    if (!error) {
      setNewReport({
        product_name: "",
        price: 0,
        currency: "JPY",
        reporter_nickname: "",
        is_verified: false,
        certification_id: "",
        store_id: "",
      });
      fetchReports();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { error } = await supabase.from("price_reports").delete().eq("id", id);
      if (!error) fetchReports();
    }
  };

  const handleEdit = (report: PriceReport) => {
    setEditingId(report.id);
    setEditedReport(report);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("price_reports")
      .update(editedReport)
      .eq("id", editingId);

    if (!error) {
      setEditingId(null);
      setEditedReport({});
      fetchReports();
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">🏆 최저가 목록 관리</h1>

      {/* 지역 필터 */}
      <div className="mb-6">
        <label className="font-medium mr-2">지역 필터:</label>
        <select
          value={selectedArea}
          onChange={(e) => handleAreaFilter(e.target.value)}
          className="border px-3 py-1 rounded-md"
        >
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* 등록 폼 */}
      <div className="bg-white rounded-xl shadow border border-gray-200 mb-6 p-6">
        <h2 className="text-lg font-bold mb-4 text-blue-700">➕ 최저가 등록</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="상품명"
            value={newReport.product_name}
            onChange={(e) => setNewReport({ ...newReport, product_name: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="가격"
            value={newReport.price}
            onChange={(e) => setNewReport({ ...newReport, price: Number(e.target.value) })}
            className="input"
          />
          <input
            type="text"
            placeholder="지점 ID"
            value={newReport.store_id}
            onChange={(e) => setNewReport({ ...newReport, store_id: e.target.value })}
            className="input"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            등록
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <table className="w-full bg-white rounded-xl shadow text-sm overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">상품명</th>
            <th className="p-3 text-left">가격</th>
            <th className="p-3 text-left">지점</th>
            <th className="p-3 text-left">제보자</th>
            <th className="p-3 text-left">일자</th>
            <th className="p-3 text-left">관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                {editingId === r.id ? (
                  <input
                    value={editedReport.product_name || ""}
                    onChange={(e) =>
                      setEditedReport({ ...editedReport, product_name: e.target.value })
                    }
                    className="input w-full"
                  />
                ) : (
                  r.product_name
                )}
              </td>
              <td className="p-3">
                {editingId === r.id ? (
                  <input
                    type="number"
                    value={editedReport.price || ""}
                    onChange={(e) =>
                      setEditedReport({ ...editedReport, price: Number(e.target.value) })
                    }
                    className="input w-full"
                  />
                ) : (
                  `¥${r.price.toLocaleString()}`
                )}
              </td>
              <td className="p-3">{r.stores?.store_name ?? "-"}</td>
              <td className="p-3">{r.reporter_nickname}</td>
              <td className="p-3">{new Date(r.report_date).toLocaleDateString("ko-KR")}</td>
              <td className="p-3 space-x-2">
                {editingId === r.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="text-green-600 text-xs font-medium"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditedReport({});
                      }}
                      className="text-gray-500 text-xs"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(r)}
                      className="text-blue-600 text-xs font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-500 text-xs"
                    >
                      삭제
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
