/* eslint-disable prettier/prettier */
// app/routes/testimony/post.ts
import Route from "@ember/routing/route";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

interface Testimony {
  name: string;
  role: string;
  image: string;
  testimony: string;
}

export default class TestimonyPostRoute extends Route {
  @tracked testimonies: Testimony[] = [];

  @tracked newTestimony: Testimony = {
    name: "",
    role: "",
    image: "",
    testimony: "",
  };

  @action
  addTestimony() {
    if (this.newTestimony.name && this.newTestimony.role && this.newTestimony.testimony) {
      this.testimonies = [...this.testimonies, { ...this.newTestimony, image: "/images/profile.jpg" }];
      this.newTestimony = { name: "", role: "", image: "", testimony: "" };
    }
  }
}