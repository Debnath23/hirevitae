"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronDown,
  Verified,
  EmployersLogo,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Alarm,
  Star,
  Img,
  AtSign,
  BellSimple,
  AlertCircle,
  File,
  Calendar,
} from "@/public/icons/index";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

const socialLinks = [
  { icon: EmployersLogo, color: "#E7F0FA", href: "#" },
  { icon: Twitter, color: "#0961F5", href: "#" },
  { icon: Linkedin, color: "#E7F0FA", href: "#" },
  { icon: Instagram, color: "#E7F0FA", href: "#" },
  { icon: Youtube, color: "#E7F0FA", href: "#" },
];

const statsItems = [
  { icon: Star, label: "Your star messages", count: 0, color: "#FFF7E7" },
  { icon: Img, label: "Docs, files, media", count: 96, color: "#FFEEF7" },
  { icon: AtSign, label: "Tagged", count: 1, color: "#E1EBFF" },
];

const activities = [
  {
    id: 1,
    title: "Payroll payment is due",
    subtitle: "Payroll due: Process #py22240932 promptly",
    time: "3min ago",
    color: "#DE1C411A",
    icon: AlertCircle,
  },
  {
    id: 2,
    title: "Document approval",
    subtitle: "New document need to be checked contract...doc or #emp22240654",
    time: "21h ago",
    color: "#F0EBFD",
    icon: File,
  },
  {
    id: 3,
    title: "New Meeting",
    subtitle:
      "Angela has set up new meeting for July 30 Monthly report meeting for July 2024",
    time: "2h ago",
    color: "#FFF4E5",
    icon: Calendar,
  },
];

function CandidateDetailsSkeleton() {
  return (
    <div className="w-96 bg-[#F8F7F7] border-l border-[#e2e8f0] overflow-y-auto hide-scrollbar animate-pulse">
      {/* Header Skeleton */}
      <div className="px-6 pt-6 pb-2">
        <div className="h-6 bg-gray-200 rounded mx-auto w-40"></div>
      </div>

      {/* Profile Section Skeleton */}
      <div className="px-6 py-6 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-[120.73px] h-[122.96px] rounded-full bg-gray-200 mx-auto"></div>
          <div className="absolute bottom-4 right-1">
            <div className="w-[21.19px] h-[21.19px] bg-gray-200 rounded-full"></div>
          </div>
          <div className="absolute -bottom-2 left-9 h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded mb-1 w-48 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-40 mx-auto"></div>

        {/* Badges Skeleton */}
        <div className="flex justify-center space-x-4 mb-6">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Social Links Skeleton */}
        <div className="flex justify-center space-x-3 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-8 h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* Application Info Skeleton */}
      <div className="px-6 mb-6">
        <div className="flex justify-center items-center mb-2">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="w-px h-[13px] border border-[#DCDCDC] mx-1"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-center items-center mb-4">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="w-px h-[13px] border border-[#DCDCDC] mx-1"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        {/* Status Badges Skeleton */}
        <div className="flex flex-col items-center mb-6 space-y-2">
          <div className="flex gap-2">
            <div className="w-[149.33px] h-[31.01px] bg-gray-200 rounded"></div>
            <div className="w-[88.2px] h-[30.1px] bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-[149.33px] h-[31.01px] bg-gray-200 rounded"></div>
            <div className="w-[88.2px] h-[30.1px] bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="mb-6 px-[15px]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-b-0"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-8 bg-gray-200 rounded-full"></div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedules Section Skeleton */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-28 bg-gray-200 rounded"></div>
              </div>
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section Skeleton */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="border-[#e2e8f0]">
              <CardContent className="p-4">
                <div className="flex space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Activities Section Skeleton */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="mb-2">
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-[#e2e8f0]">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-32 bg-gray-200 rounded"></div>
                      <div className="flex items-center space-x-1">
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function CandidateDetailsSection() {
  const { selectedUser, loadingSelectedUser } = useChatStore();
  const { isUserOnline } = useAuthStore();

  const online = isUserOnline(selectedUser?.id);

  if (loadingSelectedUser) {
    return <CandidateDetailsSkeleton />;
  }

  if (!selectedUser) {
    return (
      <div className="w-96 bg-[#F8F7F7] border-l border-[#e2e8f0] h-full flex items-center justify-center">
        <p className="text-gray-500 font-[500]">No candidate selected</p>
      </div>
    );
  }

  return (
    <div className="w-96 bg-[#F8F7F7] border-l border-[#e2e8f0] overflow-y-auto hide-scrollbar">
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-xl font-[700] text-[#242424] text-center">
          Candidate Details
        </h1>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-6 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-[120.73px] h-[122.96px] rounded-full overflow-hidden border-[1.63px] border-[#31B465]">
            <Image
              src={"/images/profile-pic.jpg"}
              alt={selectedUser?.name || "Udai Reddy Penuballi"}
              width={120.73}
              height={122.96}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-4 right-1">
            <Image src={Verified} width={21.19} height={21.19} alt="icon" />
          </div>
          <Badge
            className={`absolute -bottom-2 left-9 ${
              online ? "bg-[#E9FAF7] text-[#31B465]" : "bg-white text-slate-500"
            } text-xs font-[600] px-2 py-1 rounded-[3px]`}
          >
            {online ? "Online" : "Offline"}
          </Badge>
        </div>

        <h2 className="text-xl font-[700] text-[#242424] mb-1">
          {selectedUser?.name || "Udai Reddy Penuballi"}
        </h2>
        <p className="text-[#25AADF] font-[400] text-xs mb-4">
          Amazon | Senior Product Manager
        </p>

        <div className="flex justify-center space-x-4 mb-6 text-xs font-[500]">
          <Badge className="bg-[#FFF2E6] text-[#FD661F] px-2.5 py-1 rounded-[3.26px]">
            Full Time
          </Badge>
          <Badge className="bg-[#0961F50F] text-[#0961F5] px-2.5 py-1 rounded-[3.26px]">
            Onsite
          </Badge>
          <Badge className="bg-[#25AADF0F] text-[#25AADF] px-2.5 py-1 rounded-[3.26px]">
            1-3 Years
          </Badge>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-3 mb-6">
          {socialLinks.map((social, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-[2.93px]"
              style={{ backgroundColor: social.color }}
            >
              <Image
                src={social.icon}
                width={14.64}
                height={14.64}
                alt="icon"
              />
            </Button>
          ))}
        </div>
      </div>

      {/* Application Info */}
      <div className="px-6 mb-6">
        <div className="flex justify-center items-center mb-2">
          <span className="text-[#666666] text-sm font-[400]">
            Applied Position:
          </span>
          <div className="w-px h-[13px] border border-[#DCDCDC] mx-1"></div>
          <span className="font-[500] text-sm text-[#131B33]">
            Front End Developer
          </span>
        </div>
        <div className="flex justify-center items-center mb-4">
          <span className="text-[#666666] text-sm font-[400]">
            Applied Date:
          </span>
          <div className="w-px h-[13px] border border-[#DCDCDC] mx-1"></div>
          <span className="font-[500] text-sm text-[#131B33]">15 Jan 2025</span>
        </div>

        {/* Status Badges */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex gap-2 text-center">
            <Badge className="bg-[#FD683E] text-white px-4 py-2 rounded-[3.01px] mb-1 w-[149.33px] h-[31.01px] flex justify-center items-center cursor-pointer">
              <Image src={Alarm} width={15.03} height={15.03} alt="icon" />{" "}
              <span className="font-[600] text-[11px]">Current Stage </span>{" "}
              <ChevronRight className="w-[7.89px] h-[4.5px]" />
            </Badge>
            <div className="w-[88.2px] h-[30.1px] bg-[#0961F50F]">
              <span className="text-[#0961F5] text-xs font-[500]">
                Shortlisted
              </span>
            </div>
          </div>

          <div className="flex gap-2 text-center">
            <Badge className="bg-[#883DCF] text-white px-4 py-2 rounded-[3.01px] mb-1 w-[149.33px] h-[31.01px] flex justify-center items-center cursor-pointer">
              <Image src={Alarm} width={15.03} height={15.03} alt="icon" />{" "}
              <span className="font-[600] text-[11px]">Upcoming Stage </span>{" "}
              <ChevronRight className="w-[7.89px] h-[4.5px]" />
            </Badge>
            <div className="w-[88.2px] h-[30.1px] bg-[#0961F50F]">
              <span className="text-[#0961F5] text-xs font-[500]">
                HR Interview
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-6 px-[15px]">
        {statsItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-b-0"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                style={{ backgroundColor: `${item.color}` }}
              >
                <Image src={item.icon} width={16} height={16} alt="icon" />
              </div>
              <span className="text-[#1C1C1C] font-[500] text-sm">
                {item.label}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-[700] text-xs text-[#1C1C1C] bg-[#EEEDF0] px-2 py-0.5 rounded-full">
                {item.count}
              </span>
              <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
            </div>
          </div>
        ))}
      </div>

      {/* Schedules Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-[700] text-[15px] text-[#1E293B]">Schedules</h3>
            <Badge className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-full w-6 h-6 flex items-center justify-center text-xs font-[600] text-[#F43F5E]">
              25
            </Badge>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
        </div>

        <Card className="border-[#e2e8f0]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <Image src={Calendar} width={20} height={20} alt="icon" />
              </div>
              <div className="flex-1">
                <h4 className="font-[700] text-[#475569] text-[11px]">
                  Upcoming Presentation
                </h4>
                <p className="text-[#475569] text-[10px] font-[400]">
                  2025/08/12 at 11:21 AM
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Image src={BellSimple} width={20} height={20} alt="icon" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-[700] text-[15px] text-[#1E293B]">Notes</h3>
            <Badge className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-full w-6 h-6 flex items-center justify-center text-xs font-[600] text-[#F43F5E]">
              25
            </Badge>
          </div>
          <Image src={ChevronDown} width={16} height={16} alt="icon" />
        </div>

        <div className="space-y-0">
          {[1, 2].map((note) => (
            <Card key={note} className="border-[#e2e8f0]">
              <CardContent className="p-4">
                <div className="flex flex-col items-start">
                  <div className="flex space-x-3 mb-1 pb-2">
                    <div className="w-10 h-10 bg-[#E8E8E9] rounded-full overflow-hidden cursor-pointer">
                      <Image
                        src="/images/avatar-51.png"
                        alt="Maulida adinda ayu"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-[500] text-[#161924] text-xs">
                          Maulida adinda ayu
                        </span>
                      </div>
                      <p className="text-[#73757C] text-[10px] font-[400] mb-1">
                        Admin, owner
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-[#e2e8f0]"></div>

                  <div className="mt-1">
                    <p className="text-[#161924] text-[10px] font-[400] mb-1">
                      We will meeting for this project and deals, we still
                      meting at Monday, 02 January 2025 at 08:30pm.
                    </p>
                    <span className="text-[#73757C] text-[10px] font-[400]">
                      5 minute ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Activities Section */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-[700] text-[15px] text-[#1E293B]">
              Activities
            </h3>
            <Badge className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-full w-6 h-6 flex items-center justify-center text-xs font-[600] text-[#F43F5E]">
              25
            </Badge>
          </div>
          <Image src={ChevronDown} width={16} height={16} alt="icon" />
        </div>

        <div className="mb-2">
          <span className="text-[#A2A4AC] text-xs font-[400]">Today</span>
        </div>

        <div className="space-y-3">
          {activities.map((activity) => (
            <Card key={activity.id} className="border-[#e2e8f0]">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: activity.color }}
                  >
                    <Image
                      src={activity.icon}
                      alt="icon"
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-[500] text-[#09090B] text-[11px]">
                        {activity.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <span className="text-[#09090B] font-[400] text-[10px]">
                          {activity.time}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-[#FF0000]"></div>
                      </div>
                    </div>
                    <p className="text-[#717179] font-[400] text-[10px]">
                      {activity.subtitle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateDetailsSection;
