"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types";
import { SORT_OPTIONS, CURRENCY_SYMBOL } from "@/constants";
import styles from "./page.module.css";

// ── Inline product data (no backend dependency) ──────────
const ALL_PRODUCTS: Product[] = [
  { id:"p1", slug:"silk-maxi-dress-ivory", name:"Silk Maxi Dress", brand:"Lumière", description:"Flowing silk maxi dress with a delicate ivory finish. Effortlessly elegant for any occasion.", longDescription:"Crafted from the finest mulberry silk, this maxi dress drapes beautifully against the body.", price:485, compareAtPrice:620, images:[{id:"i1",src:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop",alt:"Silk Maxi Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["silk","maxi","evening"], colors:[{name:"Ivory",hex:"#FFFFF0"},{name:"Blush",hex:"#FFB6C1"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Ivory",stock:5,sku:"LUM-SMD-S-IVR"},{id:"v2",size:"M",color:"Ivory",stock:4,sku:"LUM-SMD-M-IVR"}], reviews:[], rating:4.7, reviewCount:24, isFeatured:true, isNew:false, isBestseller:true, stock:14, materials:["100% Mulberry Silk"], care:["Dry clean only"], sku:"LUM-SMD-001", createdAt:"2026-01-15" },
  { id:"p2", slug:"floral-wrap-dress-red", name:"Floral Wrap Dress", brand:"Lumière", description:"Vibrant floral-print wrap dress in lightweight crepe. A summer statement piece.", longDescription:"This eye-catching wrap dress features a bold floral print on a fluid crepe fabric.", price:320, compareAtPrice:395, images:[{id:"i1",src:"https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&h=1000&fit=crop",alt:"Floral Wrap Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["floral","wrap","summer"], colors:[{name:"Red Floral",hex:"#C0392B"},{name:"Blue Floral",hex:"#2980B9"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Red Floral",stock:6,sku:"LUM-FWD-S-RED"},{id:"v2",size:"M",color:"Red Floral",stock:8,sku:"LUM-FWD-M-RED"}], reviews:[], rating:4.8, reviewCount:19, isFeatured:true, isNew:true, isBestseller:false, stock:18, materials:["100% Viscose Crepe"], care:["Machine wash cold"], sku:"LUM-FWD-001", createdAt:"2026-03-20" },
  { id:"p3", slug:"bodycon-midi-dress-black", name:"Bodycon Midi Dress", brand:"Lumière", description:"Sleek bodycon midi dress in stretch jersey. Effortlessly sculpting and sophisticated.", longDescription:"Cut from a premium stretch jersey that moves with the body, this bodycon midi dress is the definition of understated glamour.", price:285, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop",alt:"Bodycon Midi Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["bodycon","midi","evening"], colors:[{name:"Black",hex:"#000000"},{name:"Burgundy",hex:"#800020"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Black",stock:7,sku:"LUM-BMD-S-BLK"},{id:"v2",size:"M",color:"Black",stock:9,sku:"LUM-BMD-M-BLK"}], reviews:[], rating:4.6, reviewCount:32, isFeatured:false, isNew:false, isBestseller:true, stock:21, materials:["92% Viscose, 8% Elastane"], care:["Machine wash cold"], sku:"LUM-BMD-001", createdAt:"2025-11-10" },
  { id:"p4", slug:"off-shoulder-mini-dress-white", name:"Off-Shoulder Mini Dress", brand:"Lumière", description:"Breezy off-shoulder mini dress in cotton voile. Effortless summer charm.", longDescription:"This delightful off-shoulder mini dress is crafted from whisper-light cotton voile.", price:195, compareAtPrice:245, images:[{id:"i1",src:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop",alt:"Off-Shoulder Mini Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["mini","off-shoulder","summer"], colors:[{name:"White",hex:"#FFFFFF"},{name:"Sky Blue",hex:"#87CEEB"}], sizes:["XS","S","M","L"], variants:[{id:"v1",size:"S",color:"White",stock:8,sku:"LUM-OSM-S-WHT"},{id:"v2",size:"M",color:"White",stock:6,sku:"LUM-OSM-M-WHT"}], reviews:[], rating:4.5, reviewCount:15, isFeatured:false, isNew:true, isBestseller:false, stock:19, materials:["100% Cotton Voile"], care:["Machine wash cold"], sku:"LUM-OSM-001", createdAt:"2026-04-01" },
  { id:"p5", slug:"boho-maxi-dress-sage", name:"Boho Maxi Dress", brand:"Lumière", description:"Free-spirited boho maxi dress in sage green. Relaxed, flowing and utterly romantic.", longDescription:"This enchanting boho maxi dress is cut from a soft, flowing fabric.", price:275, compareAtPrice:340, images:[{id:"i1",src:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1000&fit=crop",alt:"Boho Maxi Dress",width:800,height:1000}], category:"dresses", collectionId:"resort26", tags:["boho","maxi","resort"], colors:[{name:"Sage",hex:"#9DC183"},{name:"Terracotta",hex:"#E07B54"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Sage",stock:6,sku:"LUM-BHM-S-SGE"},{id:"v2",size:"M",color:"Sage",stock:7,sku:"LUM-BHM-M-SGE"}], reviews:[], rating:4.9, reviewCount:28, isFeatured:true, isNew:true, isBestseller:true, stock:17, materials:["100% Rayon"], care:["Hand wash cold"], sku:"LUM-BHM-001", createdAt:"2026-04-15" },
  { id:"p6", slug:"linen-shirt-dress-camel", name:"Linen Shirt Dress", brand:"Lumière", description:"Relaxed linen shirt dress with a belted waist. The perfect day-to-evening piece.", longDescription:"Effortlessly versatile, this linen shirt dress can be worn belted or left open.", price:310, compareAtPrice:375, images:[{id:"i1",src:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop",alt:"Linen Shirt Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["linen","shirt-dress","casual"], colors:[{name:"Camel",hex:"#C19A6B"},{name:"White",hex:"#FFFFFF"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Camel",stock:5,sku:"LUM-LSD-S-CAM"},{id:"v2",size:"M",color:"Camel",stock:7,sku:"LUM-LSD-M-CAM"}], reviews:[], rating:4.4, reviewCount:11, isFeatured:false, isNew:true, isBestseller:false, stock:16, materials:["100% Italian Linen"], care:["Machine wash cold"], sku:"LUM-LSD-001", createdAt:"2026-03-01" },
  { id:"p7", slug:"velvet-slip-dress-emerald", name:"Velvet Slip Dress", brand:"Lumière", description:"Luxurious velvet slip dress in deep emerald. Rich, sensuous, and deeply glamorous.", longDescription:"This exquisite slip dress is crafted from a sumptuous crushed velvet fabric.", price:420, compareAtPrice:520, images:[{id:"i1",src:"https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&h=1000&fit=crop",alt:"Velvet Slip Dress",width:800,height:1000}], category:"dresses", collectionId:"aw25", tags:["velvet","slip","evening"], colors:[{name:"Emerald",hex:"#50C878"},{name:"Deep Plum",hex:"#673147"}], sizes:["XS","S","M","L"], variants:[{id:"v1",size:"S",color:"Emerald",stock:4,sku:"LUM-VSD-S-EMR"},{id:"v2",size:"M",color:"Emerald",stock:5,sku:"LUM-VSD-M-EMR"}], reviews:[], rating:4.9, reviewCount:22, isFeatured:true, isNew:false, isBestseller:true, stock:12, materials:["90% Polyester Velvet"], care:["Dry clean only"], sku:"LUM-VSD-001", createdAt:"2025-10-05" },
  { id:"p8", slug:"satin-party-dress-rose", name:"Satin Party Dress", brand:"Lumière", description:"Sleek satin midi dress with a plunge neckline. Made for unforgettable evenings.", longDescription:"This head-turning satin party dress features a plunging V-neckline and cowl back.", price:365, compareAtPrice:440, images:[{id:"i1",src:"https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=800&h=1000&fit=crop",alt:"Satin Party Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["satin","party","evening"], colors:[{name:"Rose",hex:"#FF007F"},{name:"Champagne",hex:"#F7E7CE"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Rose",stock:5,sku:"LUM-SPD-S-RSE"},{id:"v2",size:"M",color:"Rose",stock:6,sku:"LUM-SPD-M-RSE"}], reviews:[], rating:4.6, reviewCount:17, isFeatured:false, isNew:true, isBestseller:false, stock:14, materials:["100% Polyester Satin"], care:["Hand wash cold"], sku:"LUM-SPD-001", createdAt:"2026-02-28" },
  { id:"p9", slug:"casual-sundress-yellow", name:"Casual Sundress", brand:"Lumière", description:"Bright and breezy sundress in butter yellow cotton. Pure summer joy.", longDescription:"This cheerful sundress is made from soft organic cotton in a radiant butter yellow.", price:165, compareAtPrice:210, images:[{id:"i1",src:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1000&fit=crop",alt:"Casual Sundress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["casual","sundress","summer"], colors:[{name:"Butter Yellow",hex:"#FFFD82"},{name:"Mint",hex:"#AAF0D1"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Butter Yellow",stock:10,sku:"LUM-CSD-S-YLW"},{id:"v2",size:"M",color:"Butter Yellow",stock:12,sku:"LUM-CSD-M-YLW"}], reviews:[], rating:4.7, reviewCount:36, isFeatured:false, isNew:false, isBestseller:true, stock:30, materials:["100% Organic Cotton"], care:["Machine wash cold"], sku:"LUM-CSD-001", createdAt:"2026-01-20" },
  { id:"p10", slug:"floral-midi-dress-blue", name:"Floral Midi Dress", brand:"Lumière", description:"Romantic floral midi dress in soft cornflower blue. Feminine, graceful and timeless.", longDescription:"This beautiful midi dress features a delicate floral print on a soft lightweight woven fabric.", price:295, compareAtPrice:360, images:[{id:"i1",src:"https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=1000&fit=crop",alt:"Floral Midi Dress",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["floral","midi","summer"], colors:[{name:"Blue Floral",hex:"#6CA0DC"},{name:"Pink Floral",hex:"#FFB6C1"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Blue Floral",stock:7,sku:"LUM-FMD-S-BLU"},{id:"v2",size:"M",color:"Blue Floral",stock:9,sku:"LUM-FMD-M-BLU"}], reviews:[], rating:4.6, reviewCount:21, isFeatured:false, isNew:true, isBestseller:false, stock:21, materials:["100% Woven Viscose"], care:["Machine wash cold"], sku:"LUM-FMD-001", createdAt:"2026-03-25" },
  { id:"p11", slug:"maxi-evening-gown-black", name:"Maxi Evening Gown", brand:"Lumière", description:"Floor-sweeping column gown in stretch crepe. Minimal, powerful, and unforgettable.", longDescription:"This spectacular floor-length gown is cut from a premium stretch crepe.", price:895, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&h=1000&fit=crop",alt:"Maxi Evening Gown",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["gown","evening","maxi","black-tie"], colors:[{name:"Black",hex:"#000000"},{name:"Ivory",hex:"#FFFFF0"}], sizes:["XS","S","M","L"], variants:[{id:"v1",size:"S",color:"Black",stock:3,sku:"LUM-MEG-S-BLK"},{id:"v2",size:"M",color:"Black",stock:4,sku:"LUM-MEG-M-BLK"}], reviews:[], rating:5.0, reviewCount:8, isFeatured:true, isNew:false, isBestseller:false, stock:9, materials:["97% Polyester Crepe, 3% Elastane"], care:["Dry clean only"], sku:"LUM-MEG-001", createdAt:"2026-02-20" },
  { id:"p12", slug:"ribbed-knit-midi-dress-chocolate", name:"Ribbed Knit Midi Dress", brand:"Lumière", description:"A sculpted ribbed knit midi dress in rich chocolate brown. Cosy yet polished.", longDescription:"This elegant ribbed knit midi dress is crafted from a luxuriously soft wool blend.", price:355, compareAtPrice:425, images:[{id:"i1",src:"https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&h=1000&fit=crop",alt:"Ribbed Knit Midi Dress",width:800,height:1000}], category:"dresses", collectionId:"aw25", tags:["knit","midi","ribbed","winter"], colors:[{name:"Chocolate",hex:"#7B3F00"},{name:"Camel",hex:"#C19A6B"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Chocolate",stock:5,sku:"LUM-RKD-S-CHC"},{id:"v2",size:"M",color:"Chocolate",stock:7,sku:"LUM-RKD-M-CHC"}], reviews:[], rating:4.7, reviewCount:29, isFeatured:true, isNew:false, isBestseller:true, stock:16, materials:["70% Merino Wool, 30% Acrylic"], care:["Hand wash cold"], sku:"LUM-RKD-001", createdAt:"2025-10-30" },
  { id:"p13", slug:"silk-crepe-blouse-white", name:"Silk Crepe Blouse", brand:"Lumière", description:"A weightless silk crepe blouse with a refined relaxed silhouette.", longDescription:"Sewn from 16mm silk crepe de chine, this blouse is a study in understated luxury.", price:245, compareAtPrice:295, images:[{id:"i1",src:"https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&h=1000&fit=crop",alt:"Silk Crepe Blouse",width:800,height:1000}], category:"tops", collectionId:"ss26", tags:["silk","blouse","workwear"], colors:[{name:"White",hex:"#FFFFFF"},{name:"Ecru",hex:"#F5F5DC"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"White",stock:8,sku:"LUM-SCB-S-WHT"},{id:"v2",size:"M",color:"White",stock:7,sku:"LUM-SCB-M-WHT"}], reviews:[], rating:4.6, reviewCount:19, isFeatured:false, isNew:false, isBestseller:false, stock:21, materials:["100% Silk Crepe de Chine"], care:["Hand wash cold"], sku:"LUM-SCB-001", createdAt:"2026-02-15" },
  { id:"p14", slug:"merino-ribbed-turtleneck", name:"Merino Ribbed Turtleneck", brand:"Lumière", description:"Finest merino wool ribbed turtleneck. The quintessential luxury essential.", longDescription:"Knitted from extra-fine 17.5 micron merino wool, this ribbed turtleneck is as soft as it is stylish.", price:195, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop",alt:"Merino Turtleneck",width:800,height:1000}], category:"tops", collectionId:"aw25", tags:["merino","knitwear","winter"], colors:[{name:"Camel",hex:"#C19A6B"},{name:"Cream",hex:"#FFFDD0"},{name:"Charcoal",hex:"#36454F"}], sizes:["XS","S","M","L","XL","XXL"], variants:[{id:"v1",size:"S",color:"Camel",stock:8,sku:"LUM-MRT-S-CAM"},{id:"v2",size:"M",color:"Camel",stock:10,sku:"LUM-MRT-M-CAM"}], reviews:[], rating:4.8, reviewCount:31, isFeatured:true, isNew:false, isBestseller:true, stock:25, materials:["100% Extra-fine Merino Wool"], care:["Hand wash cold"], sku:"LUM-MRT-001", createdAt:"2025-09-15" },
  { id:"p15", slug:"cotton-puff-sleeve-blouse", name:"Cotton Puff Sleeve Blouse", brand:"Lumière", description:"Romantic puff-sleeve blouse in soft white cotton. Sweet, feminine and utterly charming.", longDescription:"This delightful blouse features exaggerated puff sleeves that taper to fitted cuffs.", price:175, compareAtPrice:220, images:[{id:"i1",src:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop",alt:"Puff Sleeve Blouse",width:800,height:1000}], category:"tops", collectionId:"ss26", tags:["cotton","blouse","puff-sleeve"], colors:[{name:"White",hex:"#FFFFFF"},{name:"Lavender",hex:"#E6E6FA"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"White",stock:9,sku:"LUM-CPB-S-WHT"},{id:"v2",size:"M",color:"White",stock:11,sku:"LUM-CPB-M-WHT"}], reviews:[], rating:4.5, reviewCount:14, isFeatured:false, isNew:true, isBestseller:false, stock:26, materials:["100% Cotton Poplin"], care:["Machine wash cold"], sku:"LUM-CPB-001", createdAt:"2026-03-10" },
  { id:"p16", slug:"silk-camisole-champagne", name:"Silk Camisole", brand:"Lumière", description:"Delicate silk camisole in champagne gold. A whisper-light luxury layering piece.", longDescription:"This exquisite camisole is crafted from pure silk charmeuse.", price:185, compareAtPrice:230, images:[{id:"i1",src:"https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&h=1000&fit=crop",alt:"Silk Camisole",width:800,height:1000}], category:"tops", collectionId:"ss26", tags:["silk","camisole","luxury"], colors:[{name:"Champagne",hex:"#F7E7CE"},{name:"Ivory",hex:"#FFFFF0"},{name:"Black",hex:"#000000"}], sizes:["XS","S","M","L"], variants:[{id:"v1",size:"S",color:"Champagne",stock:7,sku:"LUM-SCA-S-CHP"},{id:"v2",size:"M",color:"Champagne",stock:6,sku:"LUM-SCA-M-CHP"}], reviews:[], rating:4.8, reviewCount:23, isFeatured:true, isNew:false, isBestseller:true, stock:18, materials:["100% Silk Charmeuse"], care:["Hand wash cold"], sku:"LUM-SCA-001", createdAt:"2026-01-10" },
  { id:"p17", slug:"striped-knit-top-navy", name:"Striped Knit Top", brand:"Lumière", description:"Classic Breton-inspired striped knit top. A timeless wardrobe staple.", longDescription:"This impeccably crafted Breton-stripe knit top is made from a fine cotton-merino blend.", price:155, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&h=1000&fit=crop",alt:"Striped Knit Top",width:800,height:1000}], category:"tops", collectionId:"ss26", tags:["stripe","knit","casual"], colors:[{name:"Navy/Ivory",hex:"#001F5B"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Navy/Ivory",stock:12,sku:"LUM-SKT-S-NVY"},{id:"v2",size:"M",color:"Navy/Ivory",stock:14,sku:"LUM-SKT-M-NVY"}], reviews:[], rating:4.3, reviewCount:8, isFeatured:false, isNew:false, isBestseller:false, stock:35, materials:["60% Cotton, 40% Merino Wool"], care:["Machine wash cold"], sku:"LUM-SKT-001", createdAt:"2026-02-01" },
  { id:"p18", slug:"linen-wide-leg-trousers-ecru", name:"Linen Wide Leg Trousers", brand:"Lumière", description:"Relaxed yet refined — wide-leg linen trousers in natural ecru.", longDescription:"Cut from premium Italian linen, these wide-leg trousers offer an effortlessly chic silhouette.", price:285, compareAtPrice:340, images:[{id:"i1",src:"https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop",alt:"Linen Wide Leg Trousers",width:800,height:1000}], category:"trousers", collectionId:"ss26", tags:["linen","trousers","summer"], colors:[{name:"Ecru",hex:"#F5F5DC"},{name:"Sand",hex:"#C2B280"},{name:"Black",hex:"#000000"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Ecru",stock:6,sku:"LUM-LWT-S-ECR"},{id:"v2",size:"M",color:"Ecru",stock:5,sku:"LUM-LWT-M-ECR"}], reviews:[], rating:4.5, reviewCount:12, isFeatured:false, isNew:true, isBestseller:false, stock:15, materials:["100% Italian Linen"], care:["Machine wash cold"], sku:"LUM-LWT-001", createdAt:"2026-03-01" },
  { id:"p19", slug:"tailored-cigarette-trousers-black", name:"Tailored Cigarette Trousers", brand:"Lumière", description:"Sharp cigarette-cut trousers in luxe stretch wool. Power dressing perfected.", longDescription:"These impeccably tailored cigarette trousers are cut from a premium stretch wool blend.", price:345, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1000&fit=crop",alt:"Cigarette Trousers",width:800,height:1000}], category:"trousers", collectionId:"aw25", tags:["trousers","tailored","workwear"], colors:[{name:"Black",hex:"#000000"},{name:"Charcoal",hex:"#36454F"},{name:"Ivory",hex:"#FFFFF0"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Black",stock:6,sku:"LUM-TCT-S-BLK"},{id:"v2",size:"M",color:"Black",stock:8,sku:"LUM-TCT-M-BLK"}], reviews:[], rating:4.7, reviewCount:20, isFeatured:false, isNew:false, isBestseller:true, stock:19, materials:["90% Wool, 10% Elastane"], care:["Dry clean only"], sku:"LUM-TCT-001", createdAt:"2025-09-20" },
  { id:"p20", slug:"silk-palazzo-trousers-cream", name:"Silk Palazzo Trousers", brand:"Lumière", description:"Dramatically wide-leg palazzo trousers in flowing ivory silk. Resort dressing at its finest.", longDescription:"These breathtaking palazzo trousers are cut from the finest silk charmeuse.", price:395, compareAtPrice:480, images:[{id:"i1",src:"https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&h=1000&fit=crop",alt:"Silk Palazzo Trousers",width:800,height:1000}], category:"trousers", collectionId:"resort26", tags:["silk","palazzo","resort"], colors:[{name:"Cream",hex:"#FFFDD0"},{name:"Blush",hex:"#FFB6C1"}], sizes:["XS","S","M","L"], variants:[{id:"v1",size:"S",color:"Cream",stock:4,sku:"LUM-SPT-S-CRM"},{id:"v2",size:"M",color:"Cream",stock:5,sku:"LUM-SPT-M-CRM"}], reviews:[], rating:4.6, reviewCount:9, isFeatured:false, isNew:true, isBestseller:false, stock:12, materials:["100% Silk Charmeuse"], care:["Dry clean only"], sku:"LUM-SPT-001", createdAt:"2026-04-10" },
  { id:"p21", slug:"cashmere-jogger-grey", name:"Cashmere Jogger", brand:"Lumière", description:"Luxuriously soft cashmere jogger in heather grey. Redefining casual comfort.", longDescription:"These cashmere joggers are crafted from a pure cashmere knit that feels impossibly soft.", price:465, compareAtPrice:560, images:[{id:"i1",src:"https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&h=1000&fit=crop",alt:"Cashmere Jogger",width:800,height:1000}], category:"trousers", collectionId:"aw25", tags:["cashmere","jogger","loungewear"], colors:[{name:"Heather Grey",hex:"#B2B2B2"},{name:"Camel",hex:"#C19A6B"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Heather Grey",stock:5,sku:"LUM-CJG-S-GRY"},{id:"v2",size:"M",color:"Heather Grey",stock:7,sku:"LUM-CJG-M-GRY"}], reviews:[], rating:4.9, reviewCount:27, isFeatured:true, isNew:false, isBestseller:true, stock:16, materials:["100% Grade-A Cashmere"], care:["Hand wash cold"], sku:"LUM-CJG-001", createdAt:"2025-10-15" },
  { id:"p22", slug:"tailored-culottes-cream", name:"Tailored Culottes", brand:"Lumière", description:"Elegant wide-leg culottes in premium crepe. The season's most effortless silhouette.", longDescription:"These beautifully tailored culottes hit just below the knee in a wide-leg silhouette.", price:265, compareAtPrice:315, images:[{id:"i1",src:"https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=800&h=1000&fit=crop",alt:"Tailored Culottes",width:800,height:1000}], category:"trousers", collectionId:"ss26", tags:["culottes","trousers","summer"], colors:[{name:"Cream",hex:"#FFFDD0"},{name:"Black",hex:"#000000"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Cream",stock:7,sku:"LUM-TCU-S-CRM"},{id:"v2",size:"M",color:"Cream",stock:9,sku:"LUM-TCU-M-CRM"}], reviews:[], rating:4.4, reviewCount:10, isFeatured:false, isNew:true, isBestseller:false, stock:21, materials:["100% Viscose Crepe"], care:["Machine wash cold"], sku:"LUM-TCU-001", createdAt:"2026-03-15" },
  { id:"p23", slug:"cashmere-coat-camel", name:"Cashmere Blend Coat", brand:"Lumière", description:"A masterpiece of understated luxury — double-faced cashmere coat in warm camel.", longDescription:"This impeccably tailored coat is constructed from a premium double-faced cashmere blend.", price:1250, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=1000&fit=crop",alt:"Cashmere Coat",width:800,height:1000}], category:"outerwear", collectionId:"aw25", tags:["cashmere","coat","winter","luxury"], colors:[{name:"Camel",hex:"#C19A6B"},{name:"Charcoal",hex:"#36454F"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Camel",stock:2,sku:"LUM-CCT-S-CAM"},{id:"v2",size:"M",color:"Camel",stock:3,sku:"LUM-CCT-M-CAM"}], reviews:[], rating:4.9, reviewCount:18, isFeatured:true, isNew:false, isBestseller:true, stock:7, materials:["70% Cashmere, 30% Wool"], care:["Dry clean only"], sku:"LUM-CCT-001", createdAt:"2025-10-01" },
  { id:"p24", slug:"tailored-blazer-black", name:"Tailored Blazer", brand:"Lumière", description:"A sharply tailored single-breasted blazer. The cornerstone of modern dressing.", longDescription:"Cut from a structured Italian wool blend, this blazer has been precision-tailored.", price:620, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop",alt:"Tailored Blazer",width:800,height:1000}], category:"outerwear", collectionId:"ss26", tags:["blazer","tailored","workwear"], colors:[{name:"Black",hex:"#000000"},{name:"Ivory",hex:"#FFFFF0"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Black",stock:4,sku:"LUM-TBL-S-BLK"},{id:"v2",size:"M",color:"Black",stock:6,sku:"LUM-TBL-M-BLK"}], reviews:[], rating:4.6, reviewCount:9, isFeatured:false, isNew:true, isBestseller:false, stock:13, materials:["80% Wool, 20% Silk"], care:["Dry clean only"], sku:"LUM-TBL-001", createdAt:"2026-02-10" },
  { id:"p25", slug:"oversized-wool-coat-grey", name:"Oversized Wool Coat", brand:"Lumière", description:"An oversized cocoon coat in soft mid-grey wool. Warm, modern, and minimal.", longDescription:"This season's most coveted coat takes the cocoon silhouette to new heights.", price:875, compareAtPrice:1050, images:[{id:"i1",src:"https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&h=1000&fit=crop",alt:"Oversized Wool Coat",width:800,height:1000}], category:"outerwear", collectionId:"aw25", tags:["wool","coat","oversized","winter"], colors:[{name:"Grey",hex:"#808080"},{name:"Camel",hex:"#C19A6B"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Grey",stock:3,sku:"LUM-OWC-S-GRY"},{id:"v2",size:"M",color:"Grey",stock:4,sku:"LUM-OWC-M-GRY"}], reviews:[], rating:4.8, reviewCount:15, isFeatured:true, isNew:false, isBestseller:false, stock:10, materials:["85% Wool, 15% Cashmere"], care:["Dry clean only"], sku:"LUM-OWC-001", createdAt:"2025-09-25" },
  { id:"p26", slug:"leather-moto-jacket-black", name:"Leather Moto Jacket", brand:"Lumière", description:"A refined moto jacket in buttery-soft nappa leather. Edge meets elegance.", longDescription:"This elevated moto jacket is crafted from vegetable-tanned nappa leather.", price:1450, compareAtPrice:undefined, images:[{id:"i1",src:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop",alt:"Leather Moto Jacket",width:800,height:1000}], category:"outerwear", collectionId:"aw25", tags:["leather","jacket","luxury"], colors:[{name:"Black",hex:"#000000"},{name:"Cognac",hex:"#9A463D"}], sizes:["XS","S","M","L"], variants:[{id:"v1",size:"S",color:"Black",stock:2,sku:"LUM-LMJ-S-BLK"},{id:"v2",size:"M",color:"Black",stock:3,sku:"LUM-LMJ-M-BLK"}], reviews:[], rating:4.9, reviewCount:12, isFeatured:true, isNew:false, isBestseller:true, stock:7, materials:["100% Vegetable-tanned Nappa Leather"], care:["Professional leather clean only"], sku:"LUM-LMJ-001", createdAt:"2025-10-20" },
  { id:"p27", slug:"classic-trench-coat-beige", name:"Classic Trench Coat", brand:"Lumière", description:"The iconic trench coat in cotton gabardine. Timeless, rainproof elegance.", longDescription:"A wardrobe cornerstone, this double-breasted trench coat is crafted from water-resistant cotton gabardine.", price:785, compareAtPrice:940, images:[{id:"i1",src:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop",alt:"Classic Trench Coat",width:800,height:1000}], category:"outerwear", collectionId:"ss26", tags:["trench","coat","classic"], colors:[{name:"Beige",hex:"#F5F5DC"},{name:"Black",hex:"#000000"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Beige",stock:4,sku:"LUM-CTC-S-BGE"},{id:"v2",size:"M",color:"Beige",stock:5,sku:"LUM-CTC-M-BGE"}], reviews:[], rating:4.8, reviewCount:24, isFeatured:true, isNew:false, isBestseller:true, stock:12, materials:["100% Cotton Gabardine"], care:["Dry clean only"], sku:"LUM-CTC-001", createdAt:"2026-01-05" },
  { id:"p28", slug:"quilted-jacket-ivory", name:"Quilted Jacket", brand:"Lumière", description:"A lightweight quilted jacket in ivory. Smart, packable and endlessly elegant.", longDescription:"This chic quilted jacket provides surprising warmth in a lightweight, packable form.", price:425, compareAtPrice:510, images:[{id:"i1",src:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=1000&fit=crop",alt:"Quilted Jacket",width:800,height:1000}], category:"outerwear", collectionId:"aw25", tags:["quilted","jacket","autumn"], colors:[{name:"Ivory",hex:"#FFFFF0"},{name:"Navy",hex:"#000080"}], sizes:["XS","S","M","L","XL"], variants:[{id:"v1",size:"S",color:"Ivory",stock:5,sku:"LUM-QJK-S-IVR"},{id:"v2",size:"M",color:"Ivory",stock:7,sku:"LUM-QJK-M-IVR"}], reviews:[], rating:4.5, reviewCount:11, isFeatured:false, isNew:true, isBestseller:false, stock:16, materials:["Shell: 100% Nylon", "Fill: 90% Down"], care:["Machine wash cold"], sku:"LUM-QJK-001", createdAt:"2025-09-01" },
  { id:"p29", slug:"boucle-jacket-cream", name:"Bouclé Jacket", brand:"Lumière", description:"A classic bouclé jacket in cream. Timeless Parisian chic in every stitch.", longDescription:"This exquisite short jacket is woven from a premium textured bouclé fabric.", price:695, compareAtPrice:840, images:[{id:"i1",src:"https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop",alt:"Bouclé Jacket",width:800,height:1000}], category:"outerwear", collectionId:"aw25", tags:["bouclé","jacket","luxury"], colors:[{name:"Cream",hex:"#FFFDD0"},{name:"Black",hex:"#000000"}], sizes:["XS","S","M","L"], variants:[{id:"v1",size:"S",color:"Cream",stock:3,sku:"LUM-BJK-S-CRM"},{id:"v2",size:"M",color:"Cream",stock:4,sku:"LUM-BJK-M-CRM"}], reviews:[], rating:4.9, reviewCount:16, isFeatured:true, isNew:false, isBestseller:true, stock:9, materials:["65% Wool, 30% Acrylic"], care:["Dry clean only"], sku:"LUM-BJK-001", createdAt:"2025-10-10" },
  { id:"p30", slug:"pleated-midi-skirt-ecru", name:"Pleated Midi Skirt", brand:"Lumière", description:"Flowing pleated midi skirt in ivory silk chiffon — light as air.", longDescription:"This pleated midi skirt is crafted from lightweight silk chiffon that moves beautifully.", price:325, compareAtPrice:410, images:[{id:"i1",src:"https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&h=1000&fit=crop",alt:"Pleated Midi Skirt",width:800,height:1000}], category:"dresses", collectionId:"ss26", tags:["silk","skirt","midi","summer"], colors:[{name:"Ecru",hex:"#F5F5DC"},{name:"Pale Blue",hex:"#ADD8E6"}], sizes:["XS","S","M","L"], variants:[{id:"v1",size:"S",color:"Ecru",stock:5,sku:"LUM-PMS-S-ECR"},{id:"v2",size:"M",color:"Ecru",stock:4,sku:"LUM-PMS-M-ECR"}], reviews:[], rating:4.4, reviewCount:7, isFeatured:false, isNew:true, isBestseller:false, stock:12, materials:["100% Silk Chiffon"], care:["Dry clean only"], sku:"LUM-PMS-001", createdAt:"2026-04-01" },
];

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Dresses", value: "dresses" },
  { label: "Tops", value: "tops" },
  { label: "Trousers", value: "trousers" },
  { label: "Outerwear", value: "outerwear" },
];

const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Ecru", hex: "#F5F5DC" },
  { name: "Blush", hex: "#FFB6C1" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") ?? "";
  const urlFilter = searchParams.get("filter") ?? "";
  const urlCollection = searchParams.get("collection") ?? "";

  const [category, setCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(1500);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [products] = useState<Product[]>(ALL_PRODUCTS);

  const toggleColor = (name: string) =>
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );

  const filtered = useMemo(() => {
    let result = [...products];

    // URL-based filters
    if (urlFilter === "new") result = result.filter((p) => p.isNew);
    if (urlFilter === "sale") result = result.filter((p) => p.compareAtPrice);
    if (urlCollection) result = result.filter((p) => p.collectionId === urlCollection);

    // Sidebar filters
    if (category) result = result.filter((p) => p.category === category);
    if (selectedColors.length)
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      );
    if (selectedSizes.length)
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    result = result.filter((p) => p.price <= priceMax);

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "bestselling":
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // featured
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [category, selectedColors, selectedSizes, priceMax, sortBy, urlFilter, urlCollection]);

  const activeFilterCount =
    (category ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length +
    (priceMax < 1500 ? 1 : 0);

  const clearAll = () => {
    setCategory("");
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceMax(1500);
  };

  const pageTitle =
    urlFilter === "new"
      ? "New Arrivals"
      : urlFilter === "sale"
      ? "Sale"
      : urlCollection
      ? "Collection"
      : "All Collections";

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: pageTitle }]} />

          {/* Page header */}
          <div className={styles.header}>
            <h1 className={styles.title}>{pageTitle}</h1>
            <p className={styles.count}>{filtered.length} pieces</p>
          </div>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <button
              className={[styles.toolbarBtn, filterOpen ? styles["toolbarBtn--active"] : ""].join(" ")}
              onClick={() => setFilterOpen((v) => !v)}
              aria-expanded={filterOpen}
              aria-controls="filter-panel"
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <span className={styles.filterBadge}>{activeFilterCount}</span>
              )}
            </button>

            {/* Active filter chips */}
            <div className={styles.chips} aria-label="Active filters">
              {category && (
                <button className={styles.chip} onClick={() => setCategory("")}>
                  {CATEGORIES.find((c) => c.value === category)?.label}
                  <X size={12} aria-hidden="true" />
                </button>
              )}
              {selectedColors.map((c) => (
                <button key={c} className={styles.chip} onClick={() => toggleColor(c)}>
                  {c} <X size={12} aria-hidden="true" />
                </button>
              ))}
              {selectedSizes.map((s) => (
                <button key={s} className={styles.chip} onClick={() => toggleSize(s)}>
                  {s} <X size={12} aria-hidden="true" />
                </button>
              ))}
              {activeFilterCount > 0 && (
                <button className={styles.clearChip} onClick={clearAll}>
                  Clear all
                </button>
              )}
            </div>

            {/* Sort */}
            <div className={styles.sortWrapper}>
              <button
                className={styles.toolbarBtn}
                onClick={() => setSortOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort"}
                <ChevronDown size={14} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.ul
                    className={styles.sortMenu}
                    role="listbox"
                    aria-label="Sort options"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          className={[
                            styles.sortOption,
                            sortBy === opt.value ? styles["sortOption--active"] : "",
                          ].join(" ")}
                          role="option"
                          aria-selected={sortBy === opt.value}
                          onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.body}>
            {/* ── Filter sidebar ─────────────────────────── */}
            <AnimatePresence>
              {filterOpen && (
                <motion.aside
                  id="filter-panel"
                  className={styles.sidebar}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Filters"
                >
                  {/* Category */}
                  <div className={styles.filterGroup}>
                    <h3 className={styles.filterGroupTitle}>Category</h3>
                    <ul className={styles.filterList}>
                      {CATEGORIES.map((cat) => (
                        <li key={cat.value}>
                          <button
                            className={[
                              styles.filterOption,
                              category === cat.value ? styles["filterOption--active"] : "",
                            ].join(" ")}
                            onClick={() => setCategory(cat.value)}
                            aria-pressed={category === cat.value}
                          >
                            {cat.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Color */}
                  <div className={styles.filterGroup}>
                    <h3 className={styles.filterGroupTitle}>Colour</h3>
                    <div className={styles.colorGrid} role="group" aria-label="Filter by colour">
                      {COLORS.map((col) => (
                        <label
                          key={col.name}
                          className={[
                            styles.colorFilterOption,
                            selectedColors.includes(col.name) ? styles["colorFilterOption--selected"] : "",
                          ].join(" ")}
                          title={col.name}
                        >
                          <input
                            type="checkbox"
                            checked={selectedColors.includes(col.name)}
                            onChange={() => toggleColor(col.name)}
                            className={styles.srOnly}
                            aria-label={col.name}
                          />
                          <span
                            className={styles.colorFilterSwatch}
                            style={{ backgroundColor: col.hex, border: col.hex === "#FFFFFF" ? "1px solid #ddd" : "none" }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className={styles.filterGroup}>
                    <h3 className={styles.filterGroupTitle}>Size</h3>
                    <div className={styles.sizeGrid} role="group" aria-label="Filter by size">
                      {SIZES.map((size) => (
                        <label
                          key={size}
                          className={[
                            styles.sizeFilterOption,
                            selectedSizes.includes(size) ? styles["sizeFilterOption--selected"] : "",
                          ].join(" ")}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={() => toggleSize(size)}
                            className={styles.srOnly}
                            aria-label={size}
                          />
                          {size}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className={styles.filterGroup}>
                    <h3 className={styles.filterGroupTitle}>
                      Max Price: <strong>{CURRENCY_SYMBOL}{priceMax.toLocaleString()}</strong>
                    </h3>
                    <input
                      type="range"
                      min={50}
                      max={1500}
                      step={50}
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className={styles.priceRange}
                      aria-label={`Maximum price: ${CURRENCY_SYMBOL}${priceMax}`}
                    />
                    <div className={styles.priceLabels}>
                      <span>{CURRENCY_SYMBOL}50</span>
                      <span>{CURRENCY_SYMBOL}1,500</span>
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" fullWidth onClick={clearAll}>
                      Clear All Filters
                    </Button>
                  )}
                </motion.aside>
              )}
            </AnimatePresence>

            {/* ── Product grid ───────────────────────────── */}
            <div className={[styles.grid, filterOpen ? styles["grid--narrow"] : ""].join(" ")}>
              {filtered.length === 0 ? (
                <div className={styles.emptyWrapper}>
                  <EmptyState
                    title="No products found"
                    description="Try adjusting your filters to see more results."
                    action={
                      <Button variant="outline" size="md" onClick={clearAll}>
                        Clear Filters
                      </Button>
                    }
                  />
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.22, delay: i * 0.03 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
