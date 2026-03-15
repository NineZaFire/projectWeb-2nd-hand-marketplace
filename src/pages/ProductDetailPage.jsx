import React from "react";
import { ShopProduct } from "../models/ShopProduct";
import { ProductCategory } from "../models/ProductCategory";

export class ProductDetailPage extends React.Component {
  toProduct() {
    const { product } = this.props;
    if (!product) return ShopProduct.empty();
    if (product instanceof ShopProduct) return product;
    return ShopProduct.fromJSON(product);
  }

  render() {
    const product = this.toProduct();
    const imageUrls = product.getImageUrls();
    const primaryImage = imageUrls[0] ?? "";
    const hasProductData = Boolean(product?.id || product?.name);

    return (
      <div className="min-h-dvh bg-zinc-50">
        <div className="sticky top-0 z-40 bg-[#A4E3D8] border-b border-zinc-200">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
            <button
              className="h-10 w-10 rounded-xl bg-[#F4D03E] border border-zinc-200 grid place-items-center text-lg"
              onClick={this.props.onBack}
              title="ย้อนกลับ"
              aria-label="ย้อนกลับ"
            >
              ←
            </button>
            <div className="font-semibold text-zinc-900">รายละเอียดสินค้า</div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="rounded-2xl bg-white shadow p-4 md:p-6">
            {!hasProductData ? (
              <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                ยังไม่มีข้อมูลสินค้า
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[22rem_minmax(0,1fr)]">
                <div className="space-y-3">
                  <div className="aspect-square rounded-2xl bg-zinc-100 overflow-hidden grid place-items-center">
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={product?.name ?? "product-image"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-zinc-400">ไม่มีรูปภาพ</span>
                    )}
                  </div>
                  {imageUrls.length > 1 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {imageUrls.map((url, index) => (
                        <div
                          key={`${product.id || product.name}-preview-${index}`}
                          className="aspect-square rounded-lg border border-zinc-200 overflow-hidden"
                        >
                          <img src={url} alt={`${product.name}-${index + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <div className="text-2xl font-semibold text-zinc-900 break-words">
                    {product?.name || "ไม่ระบุชื่อสินค้า"}
                  </div>
                  <div className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700">
                    {ProductCategory.getLabel(product?.category)}
                  </div>
                  <div className="text-xl font-semibold text-zinc-800">{product?.getPriceLabel?.() ?? "฿0.00"}</div>
                  <p className="rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700 whitespace-pre-line break-words">
                    {product?.description || "ยังไม่มีคำอธิบายสินค้า"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
