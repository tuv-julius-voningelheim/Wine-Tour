CREATE TYPE "public"."cellar_state" AS ENUM('owned', 'wishlist', 'tasted', 'finished');--> statement-breakpoint
CREATE TYPE "public"."event_modality" AS ENUM('online', 'in-person', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."event_visibility" AS ENUM('private', 'unlisted', 'public');--> statement-breakpoint
CREATE TYPE "public"."media_access" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."media_provider" AS ENUM('local', 'vercel-blob', 'neon-object-storage', 'external');--> statement-breakpoint
CREATE TYPE "public"."membership_role" AS ENUM('member', 'host', 'winery', 'merchant', 'admin');--> statement-breakpoint
CREATE TYPE "public"."publish_state" AS ENUM('draft', 'published', 'paused');--> statement-breakpoint
CREATE TYPE "public"."verification_state" AS ENUM('unverified', 'pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."wine_style" AS ENUM('red', 'white', 'rose', 'sparkling', 'sweet', 'fortified');--> statement-breakpoint
CREATE TABLE "academy_lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"eyebrow" text NOT NULL,
	"minutes" integer NOT NULL,
	"summary" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_meta" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aromas" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"family" text NOT NULL,
	"subfamily" text NOT NULL,
	"tier" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_snapshots" (
	"id" text PRIMARY KEY NOT NULL,
	"version" text NOT NULL,
	"counts" jsonb NOT NULL,
	"payload" jsonb NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_snapshots" (
	"id" text PRIMARY KEY NOT NULL,
	"version" text NOT NULL,
	"counts" jsonb NOT NULL,
	"payload" jsonb NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cellar_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wine_id" text,
	"custom_name" text,
	"producer_name" text,
	"region_name" text,
	"vintage" integer,
	"state" "cellar_state" DEFAULT 'owned' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"details" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"key" text PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"configuration" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grape_aromas" (
	"grape_id" text NOT NULL,
	"aroma_id" text NOT NULL,
	CONSTRAINT "grape_aromas_grape_id_aroma_id_pk" PRIMARY KEY("grape_id","aroma_id")
);
--> statement-breakpoint
CREATE TABLE "grapes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"summary" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_grapes" (
	"lesson_id" text NOT NULL,
	"grape_id" text NOT NULL,
	CONSTRAINT "lesson_grapes_lesson_id_grape_id_pk" PRIMARY KEY("lesson_id","grape_id")
);
--> statement-breakpoint
CREATE TABLE "lesson_regions" (
	"lesson_id" text NOT NULL,
	"region_id" text NOT NULL,
	CONSTRAINT "lesson_regions_lesson_id_region_id_pk" PRIMARY KEY("lesson_id","region_id")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" "media_provider" NOT NULL,
	"access" "media_access" DEFAULT 'public' NOT NULL,
	"storage_key" text NOT NULL,
	"url" text,
	"mime_type" text NOT NULL,
	"width" integer,
	"height" integer,
	"alt_text" text NOT NULL,
	"owner_user_id" uuid,
	"owner_workspace_id" text,
	"entity_type" text,
	"entity_id" text,
	"metadata" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "producer_regions" (
	"producer_id" text NOT NULL,
	"region_id" text NOT NULL,
	CONSTRAINT "producer_regions_producer_id_region_id_pk" PRIMARY KEY("producer_id","region_id")
);
--> statement-breakpoint
CREATE TABLE "producers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"primary_region_id" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"summary" text NOT NULL,
	"content" jsonb NOT NULL,
	"source_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"score" integer NOT NULL,
	"review" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "region_grapes" (
	"region_id" text NOT NULL,
	"grape_id" text NOT NULL,
	CONSTRAINT "region_grapes_region_id_grape_id_pk" PRIMARY KEY("region_id","grape_id")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"summary" text NOT NULL,
	"content" jsonb NOT NULL,
	"source_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasting_events" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"modality" "event_modality" NOT NULL,
	"visibility" "event_visibility" NOT NULL,
	"state" "publish_state" NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasting_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wine_id" text,
	"cellar_item_id" uuid,
	"event_id" text,
	"rating" integer,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"email" text,
	"role" "membership_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wine_aromas" (
	"wine_id" text NOT NULL,
	"aroma_id" text NOT NULL,
	CONSTRAINT "wine_aromas_wine_id_aroma_id_pk" PRIMARY KEY("wine_id","aroma_id")
);
--> statement-breakpoint
CREATE TABLE "wine_grapes" (
	"wine_id" text NOT NULL,
	"grape_id" text NOT NULL,
	CONSTRAINT "wine_grapes_wine_id_grape_id_pk" PRIMARY KEY("wine_id","grape_id")
);
--> statement-breakpoint
CREATE TABLE "wines" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"producer_id" text NOT NULL,
	"region_id" text NOT NULL,
	"style" "wine_style" NOT NULL,
	"vintage" integer,
	"summary" text NOT NULL,
	"content" jsonb NOT NULL,
	"source_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"workspace_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "membership_role" NOT NULL,
	"permissions" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_members_workspace_id_user_id_pk" PRIMARY KEY("workspace_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" "membership_role" NOT NULL,
	"verification" "verification_state" NOT NULL,
	"state" "publish_state" NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cellar_items" ADD CONSTRAINT "cellar_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cellar_items" ADD CONSTRAINT "cellar_items_wine_id_wines_id_fk" FOREIGN KEY ("wine_id") REFERENCES "public"."wines"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grape_aromas" ADD CONSTRAINT "grape_aromas_grape_id_grapes_id_fk" FOREIGN KEY ("grape_id") REFERENCES "public"."grapes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grape_aromas" ADD CONSTRAINT "grape_aromas_aroma_id_aromas_id_fk" FOREIGN KEY ("aroma_id") REFERENCES "public"."aromas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_grapes" ADD CONSTRAINT "lesson_grapes_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_grapes" ADD CONSTRAINT "lesson_grapes_grape_id_grapes_id_fk" FOREIGN KEY ("grape_id") REFERENCES "public"."grapes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_regions" ADD CONSTRAINT "lesson_regions_lesson_id_academy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."academy_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_regions" ADD CONSTRAINT "lesson_regions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_workspace_id_workspaces_id_fk" FOREIGN KEY ("owner_workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_regions" ADD CONSTRAINT "producer_regions_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producer_regions" ADD CONSTRAINT "producer_regions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producers" ADD CONSTRAINT "producers_primary_region_id_regions_id_fk" FOREIGN KEY ("primary_region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_grapes" ADD CONSTRAINT "region_grapes_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_grapes" ADD CONSTRAINT "region_grapes_grape_id_grapes_id_fk" FOREIGN KEY ("grape_id") REFERENCES "public"."grapes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasting_events" ADD CONSTRAINT "tasting_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD CONSTRAINT "tasting_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD CONSTRAINT "tasting_notes_wine_id_wines_id_fk" FOREIGN KEY ("wine_id") REFERENCES "public"."wines"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD CONSTRAINT "tasting_notes_cellar_item_id_cellar_items_id_fk" FOREIGN KEY ("cellar_item_id") REFERENCES "public"."cellar_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD CONSTRAINT "tasting_notes_event_id_tasting_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."tasting_events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wine_aromas" ADD CONSTRAINT "wine_aromas_wine_id_wines_id_fk" FOREIGN KEY ("wine_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wine_aromas" ADD CONSTRAINT "wine_aromas_aroma_id_aromas_id_fk" FOREIGN KEY ("aroma_id") REFERENCES "public"."aromas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wine_grapes" ADD CONSTRAINT "wine_grapes_wine_id_wines_id_fk" FOREIGN KEY ("wine_id") REFERENCES "public"."wines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wine_grapes" ADD CONSTRAINT "wine_grapes_grape_id_grapes_id_fk" FOREIGN KEY ("grape_id") REFERENCES "public"."grapes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wines" ADD CONSTRAINT "wines_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wines" ADD CONSTRAINT "wines_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "academy_lessons_title_idx" ON "academy_lessons" USING btree ("title");--> statement-breakpoint
CREATE INDEX "aromas_family_idx" ON "aromas" USING btree ("family");--> statement-breakpoint
CREATE INDEX "aromas_name_idx" ON "aromas" USING btree ("name");--> statement-breakpoint
CREATE INDEX "cellar_items_user_idx" ON "cellar_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cellar_items_wine_idx" ON "cellar_items" USING btree ("wine_id");--> statement-breakpoint
CREATE INDEX "grapes_name_idx" ON "grapes" USING btree ("name");--> statement-breakpoint
CREATE INDEX "media_assets_entity_idx" ON "media_assets" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "media_assets_owner_idx" ON "media_assets" USING btree ("owner_user_id","owner_workspace_id");--> statement-breakpoint
CREATE INDEX "producers_region_idx" ON "producers" USING btree ("primary_region_id");--> statement-breakpoint
CREATE INDEX "producers_name_idx" ON "producers" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "ratings_user_entity_unique" ON "ratings" USING btree ("user_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "ratings_entity_idx" ON "ratings" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "regions_country_idx" ON "regions" USING btree ("country");--> statement-breakpoint
CREATE INDEX "regions_name_idx" ON "regions" USING btree ("name");--> statement-breakpoint
CREATE INDEX "tasting_events_start_idx" ON "tasting_events" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "tasting_events_workspace_idx" ON "tasting_events" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "tasting_notes_user_idx" ON "tasting_notes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tasting_notes_wine_idx" ON "tasting_notes" USING btree ("wine_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_unique" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "wines_region_idx" ON "wines" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "wines_producer_idx" ON "wines" USING btree ("producer_id");--> statement-breakpoint
CREATE INDEX "wines_name_idx" ON "wines" USING btree ("name");