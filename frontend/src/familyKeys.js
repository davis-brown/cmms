import FamilyService from "./services/FamilyService";
import FamilyPersonService from "./services/FamilyPersonService";

// { per_ID: "fam-<fam_ID>" } for everyone in a family, so a person's avatar takes
// their family's colour on every page. The group cards on one page share a load;
// shortcut: one request per family, swap for a single API call if families grow past ~100.
let pending = null;
export function loadFamilyKeys() {
  if (!pending) {
    pending = FamilyService.getFamilies()
      .then(response => Promise.all(response.data.map(family =>
        FamilyPersonService.getFamilyPersons(family.fam_ID).then(members =>
          members.data.map(member => [member.per_ID, familyKey(family.fam_ID)])))))
      .then(lists => {
        // Forget it soon so edits to a family show up on the next page
        setTimeout(() => { pending = null; }, 10000);
        return Object.fromEntries(lists.flat());
      })
      .catch(() => {
        pending = null;
        return {};
      });
  }
  return pending;
}

export function familyKey(fam_ID) {
  return `fam-${fam_ID}`;
}
