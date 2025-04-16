"use server";

import { getEffectiveUserId } from "@/lib/get-effective-user-id";
import { formatDistanceToNowStrict } from "date-fns";
import { id } from "date-fns/locale";
import { db } from "@/lib/db";
import { NotificationType as PrismaNotificationType } from "@prisma/client";

export type NotificationType = "info" | "warning" | "success" | "error";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // Formatted time ago (e.g., "10 menit lalu")
  isRead: boolean;
};

export interface NotificationFilters {
  type?: NotificationType | "all";
  startDate?: Date;
  endDate?: Date;
  readStatus?: "all" | "read" | "unread";
}

export interface PaginatedNotificationsResult {
  success: boolean;
  data?: NotificationItem[];
  totalCount?: number;
  error?: string;
}

// Helper function to convert Prisma NotificationType to our NotificationType
const mapNotificationType = (type: PrismaNotificationType): NotificationType => {
  return type.toLowerCase() as NotificationType;
};

// Helper function to format notification timestamp
const formatNotificationTimestamp = (date: Date): string => {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: id,
  });
};

// Get notifications with optional limit
export const getNotifications = async (
  limit: number = 10
): Promise<{
  success: boolean;
  data?: NotificationItem[];
  error?: string;
}> => {
  return getFilteredNotifications({ limit });
};

// Get filtered notifications with pagination
export const getFilteredNotifications = async (
  options: {
    limit?: number;
    offset?: number;
    filters?: NotificationFilters;
  } = {}
): Promise<PaginatedNotificationsResult> => {
  try {
    const effectiveUserId = await getEffectiveUserId();

    if (!effectiveUserId) {
      return { success: false, error: "Tidak terautentikasi!" };
    }

    // Build the where clause for filtering
    const where: any = { userId: effectiveUserId };
        
    // Apply filters if provided
    if (options.filters) {
      const { type, readStatus, startDate, endDate } = options.filters;
            
      // Filter by type
      if (type && type !== "all") {
        where.type = type.toUpperCase();
      }
            
      // Filter by read status
      if (readStatus && readStatus !== "all") {
        where.isRead = readStatus === "read";
      }
            
      // Filter by date range
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }
    }

    //cGol  ppagnaf pgcnsit
    efetlCofceatotalCount ut({wher };
  } catch (error) {
    console.epagrnarreng notifications:", error);
   ufe, trli"nm=lim ||10;
offofse || 0
// Mark a notification as read
port//oFmochtnom aab
omisconste{s awaitdb.findMan({ boolean;
  errowhere,}> => {
 try odrBy:
    conscreafctAd: 'deac',w//iNtwfse ;s
},
kip:,
f (!ev k:lm,
  retur

   ////Mappethabaseinfication.updayo ou{ Imtype
    e: {mppdN: NIm[]: new Date()map ({
      ,
    })eype:.mapNrror("ErrorTrp otype,
      eifla:l,tle,
      meosGgg:amenandai not.mkasai ,telah dibaca.",
  }sap:/mTimsmp(tffecacerI radA),
    e csRe{d:nuRrad 
})
    // Update all notifications in the database
    await db 
     .notification.u 
     pdateMamapn 
      
   
      where: {
        userId: effectiveUserId,
        isRead: false,
      },
      data: {
        isRead: true,
   Maukw(  },red
expr   });mrkAReadasync(
returastr {
).ePrrm me<{king all notifications as read:", error);
resuccurn: boole n;
sus:e,?:ri;
}>=>{
  try {
    conr:gefaecnnveUderId = inafkgEffciveUsrId;

if(!eectvUsrI)t{ a new notification
rt  dareturnt{a uccss error: "Tidak terautentikasi!" u;erId: string;
    }ype: NotificationType;
ing;
   m//eUpdasg:thnntde
succow db.ifaio .upd: sMi}y: string;
}> => whe: {
  try {
    // CurIeffecivUserId
      // Create notification in database
      aatata{
      rtIsRade,t
       tedAs: e 
    })}
    c);cess: true, 
ta: { id: notification.id } 
    return}{;uccsstru };
} c catch (error) cuccess: false, error: "Gagal membuat notifikasi." };
}consol.(Errormrkingn:r);rurscslorGgendanokssbghbc.";}
}MrklsradexportmrkAlAsRadasyn()Prms<{
:ban;r?:sti;}>=>{ty{coseffectiveUsId=wgtEffcvUeI();i!effcveUserId u{uces:fs,r:"Tkeuetiki!"};}

Updtllhabaswatb.ct.pMy{he:userI: eectvUsrIfl  ,: {,dA: nwD(),,
  }
all ssemua Createa ew notifia
exportconsceteN =ync (
 dat: {    usId: sring;
   ype:nType;
    title: strig;
    meag:trig;
 }
an;
  dat?: { id: strig }Covertnotifiction type toPisma num
   const type = dta.tye.toUperCase()aPrismaNtificationTye;

    // Crenoification int ntificto =awitdb..create({
      data: {
        uerId:dat.uerId,
       type,
        titl: dta.title,
        message: ata.message,
      },
    }
 
     , 
      data: {id: notification.id } 
    cretbt