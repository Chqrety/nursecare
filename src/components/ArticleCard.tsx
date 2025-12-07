"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ArticleCard({ article }: { article: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
        {/* Gambar Artikel */}
        <div className="h-48 w-full overflow-hidden rounded-t-lg bg-gray-200">
          <img
            src={article.image_url || "https://placehold.co/600x400"}
            alt={article.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>

        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary">{article.category}</Badge>
          </div>
          <CardTitle className="text-lg line-clamp-2 leading-tight">{article.title}</CardTitle>
        </CardHeader>

        <CardContent className="grow">
          <p className="text-gray-500 text-sm line-clamp-3">{article.content}</p>
        </CardContent>

        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsOpen(true)}>
            Baca Selengkapnya
          </Button>
        </CardFooter>
      </Card>

      {/* POPUP BACA */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="mb-4 rounded-lg overflow-hidden h-48 w-full">
              <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <DialogTitle className="text-2xl">{article.title}</DialogTitle>
            <DialogDescription className="mt-4 text-gray-600 leading-relaxed whitespace-pre-wrap text-left">
              {article.content}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
