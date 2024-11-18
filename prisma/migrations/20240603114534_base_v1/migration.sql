-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "policy" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "effect" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "fields" JSONB,
    "conditions" JSONB,
    "args" JSONB,
    "encode" TEXT NOT NULL,

    CONSTRAINT "policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_policies" (
    "roleId" INTEGER NOT NULL,
    "policyId" INTEGER NOT NULL,

    CONSTRAINT "role_policies_pkey" PRIMARY KEY ("roleId","policyId")
);

-- CreateTable
CREATE TABLE "permission_polices" (
    "permissionId" INTEGER NOT NULL,
    "policyId" INTEGER NOT NULL,

    CONSTRAINT "permission_polices_pkey" PRIMARY KEY ("permissionId","policyId")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "path" TEXT NOT NULL,
    "component" TEXT,
    "redirect" TEXT,
    "fullPath" TEXT,
    "alias" TEXT,
    "label" TEXT,
    "parentId" INTEGER,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_meta" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "layout" TEXT,
    "order" INTEGER DEFAULT 100,
    "icon" TEXT,
    "hideMenu" BOOLEAN NOT NULL DEFAULT false,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "menuId" INTEGER NOT NULL,

    CONSTRAINT "menu_meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_menus" (
    "roleId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,

    CONSTRAINT "role_menus_pkey" PRIMARY KEY ("roleId","menuId")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "policy_encode_key" ON "policy"("encode");

-- CreateIndex
CREATE UNIQUE INDEX "menus_name_key" ON "menus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "menu_meta_menuId_key" ON "menu_meta"("menuId");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_policies" ADD CONSTRAINT "role_policies_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_policies" ADD CONSTRAINT "role_policies_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_polices" ADD CONSTRAINT "permission_polices_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_polices" ADD CONSTRAINT "permission_polices_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_meta" ADD CONSTRAINT "menu_meta_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_menus" ADD CONSTRAINT "role_menus_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_menus" ADD CONSTRAINT "role_menus_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
