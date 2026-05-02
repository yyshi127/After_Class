export type CampusScopedClass = {
  id: string;
  campusId: string;
};

export function assertClassBelongsToCampus(custodyClass: CampusScopedClass, campusId: string): void {
  if (custodyClass.campusId !== campusId) {
    throw new Error('班级必须属于指定校区');
  }
}
