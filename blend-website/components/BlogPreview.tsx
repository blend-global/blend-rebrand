import Image from "next/image";
import { blogSection } from "@/lib/data";

export default function BlogPreview() {
  return (
    <section id="blog" className="bg-white py-16">
      <div className="container-max flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#0e0e10]">{blogSection.title}</h2>
          <button className="pill-button pill-primary text-sm font-semibold">{blogSection.cta}</button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {blogSection.featured.map((post) => (
            <div
              key={post.title}
              className="overflow-hidden rounded-[28px] bg-white shadow-light ring-1 ring-black/5"
            >
              <Image
                src={post.image}
                alt={post.title}
                width={900}
                height={700}
                className="h-[320px] w-full object-cover"
              />
              <div className="p-5">
                <div className="text-sm font-semibold uppercase tracking-wide text-[#5c5f66]">
                  {post.title}
                </div>
                <p className="mt-2 text-base font-semibold text-[#1a1b1f]">{post.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
          {blogSection.posts.map((post) => (
            <div
              key={post.title}
              className="overflow-hidden rounded-[20px] bg-white shadow-light ring-1 ring-black/5"
            >
              <Image
                src={post.image}
                alt={post.title}
                width={320}
                height={200}
                className="h-[140px] w-full object-cover"
              />
              <div className="px-3 py-3 text-center text-sm font-semibold text-[#2f3034]">
                {post.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
