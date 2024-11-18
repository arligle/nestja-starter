-- CreateTable
CREATE TABLE "dict_attachment_attributes" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,

    CONSTRAINT "dict_attachment_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachment_attributes" (
    "attachmentId" INTEGER NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "desc" TEXT,

    CONSTRAINT "attachment_attributes_pkey" PRIMARY KEY ("attachmentId","attributeId")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "name" TEXT,
    "ossType" TEXT,
    "userId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "desc" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT,
    "desc" TEXT,
    "coverId" INTEGER,
    "authorId" INTEGER NOT NULL,
    "originPrice" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "status" INTEGER NOT NULL DEFAULT 0,
    "counts" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 1000,
    "detail" TEXT,
    "type" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_contents" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "order" INTEGER NOT NULL DEFAULT 1000,
    "pid" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 0,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "course_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_attachments" (
    "contentId" INTEGER NOT NULL,
    "attachmentId" INTEGER NOT NULL,

    CONSTRAINT "content_attachments_pkey" PRIMARY KEY ("contentId","attachmentId")
);

-- CreateTable
CREATE TABLE "dict_course_tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 1000,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "dict_course_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dict_course_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 100,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "dict_course_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_tags" (
    "courseId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "course_tags_pkey" PRIMARY KEY ("courseId","tagId")
);

-- CreateTable
CREATE TABLE "course_content_tags" (
    "contentId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "course_content_tags_pkey" PRIMARY KEY ("contentId","tagId")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "pid" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hands" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 1,
    "isBest" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_comments" (
    "courseId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "course_comments_pkey" PRIMARY KEY ("courseId","commentId")
);

-- CreateTable
CREATE TABLE "content_comments" (
    "contentId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "content_comments_pkey" PRIMARY KEY ("commentId","contentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "dict_attachment_attributes_type_name_key" ON "dict_attachment_attributes"("type", "name");

-- CreateIndex
CREATE UNIQUE INDEX "dict_course_tag_name_typeId_key" ON "dict_course_tag"("name", "typeId");

-- CreateIndex
CREATE UNIQUE INDEX "dict_course_type_name_key" ON "dict_course_type"("name");

-- AddForeignKey
ALTER TABLE "attachment_attributes" ADD CONSTRAINT "attachment_attributes_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment_attributes" ADD CONSTRAINT "attachment_attributes_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "dict_attachment_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_contents" ADD CONSTRAINT "course_contents_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_contents" ADD CONSTRAINT "course_contents_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_attachments" ADD CONSTRAINT "content_attachments_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "course_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_attachments" ADD CONSTRAINT "content_attachments_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dict_course_tag" ADD CONSTRAINT "dict_course_tag_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "dict_course_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_tags" ADD CONSTRAINT "course_tags_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_tags" ADD CONSTRAINT "course_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "dict_course_tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_content_tags" ADD CONSTRAINT "course_content_tags_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "course_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_content_tags" ADD CONSTRAINT "course_content_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "dict_course_tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_pid_fkey" FOREIGN KEY ("pid") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_comments" ADD CONSTRAINT "course_comments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_comments" ADD CONSTRAINT "course_comments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_comments" ADD CONSTRAINT "content_comments_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "course_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_comments" ADD CONSTRAINT "content_comments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
